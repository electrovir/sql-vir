import {DeepReadonly, getObjectTypedKeys} from './augments';
import {DatabaseConnectionConfig, DatabaseConnectionInputConfig} from './database-config';
import {inferTable, TableConnectionType, TableInputType, TableType} from './table';

/**
 * used for table definitions in a database object
 */
export type DatabaseTables<
    // require at least the input table type
    TableGeneric extends TableInputType
> = {[tableName: string]: TableGeneric};

/**
 * the information required in both input and output Database types
 */
export type CommonDatabaseInfoType = {
    version?: number;
};

/**
 * stores all the information required to connect to a database and includes all that data within
 * each individual table so that they can be independently used for queries.
 */
export type DatabaseType = {
    tables: DatabaseTables<TableType>;
    connection: DatabaseConnectionConfig;
} & CommonDatabaseInfoType;

/**
 * minimal database type definition for input into inferDatabase
 */
export type DatabaseInputType = {
    tables: DatabaseTables<TableInputType>;
    connection: DatabaseConnectionInputConfig;
} & CommonDatabaseInfoType;

/**
 * Infers a database type while checking it for the correct format while also inserting all the
 * database connection information into each table so that each table can be used independent of the
 * entire database object.
 */
export function inferDatabase<DatabaseGeneric extends DatabaseInputType>(
    databaseInput: DatabaseGeneric,
) {
    /**
     * For some reason this keeps the types within the reduce happy and acting as they should
     */
    type TableReducing = {
        // Why does databaseInput.tables vs databaseInput['tables'] make a difference???? ¯\_(ツ)_/¯
        [TableName in keyof typeof databaseInput.tables]: Readonly<
            typeof databaseInput.tables[TableName] & TableConnectionType
        >;
    };

    /**
     * If this isn't used for the output we lose the stricter typing for each table's `sampleRow`
     * that the generic gives us. We also want the output
     */
    type TablesOutput = {
        // Why does databaseInput.tables vs databaseInput['tables'] make a difference???? ¯\_(ツ)_/¯
        [TableName in keyof typeof databaseInput['tables']]: Readonly<
            typeof databaseInput['tables'][TableName] & TableConnectionType
        >;
    };

    // insert the database connection information into each table while maintaining the type info
    const finalizedTables: Readonly<TablesOutput> = getObjectTypedKeys(databaseInput.tables).reduce(
        (tableJoining, tableName) => {
            // not null asserted because the key is taken from the object itself
            const table = databaseInput.tables[tableName]!;

            tableJoining[tableName] = inferTable({
                ...table,
                databaseConnection: {
                    host: '',
                    databaseName: '',
                    user: {
                        username: '',
                        password: '',
                        domain: '',
                    },
                },
                /*
                    typescript thinks that `tableName` can be a number even though the generic
                    defines it as only a string ¯\_(ツ)_/¯ 
                */
                tableName: String(tableName),
            });
            return tableJoining;
        },
        {} as TableReducing,
    ) as Readonly<TablesOutput>;

    const dbInfo: DeepReadonly<CommonDatabaseInfoType> = databaseInput;

    const combinedDatabase = {
        ...dbInfo,
        // override the tables property (though TypeScript doesn't think it exists yet anyway)
        tables: finalizedTables,
    };

    return combinedDatabase as Readonly<typeof combinedDatabase>;
}
