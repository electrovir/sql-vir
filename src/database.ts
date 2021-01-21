import {ConnectionInfo} from './connection';
import {DeepReadonly, getObjectTypedKeys} from './augments';
import {ExtraTableInfoType, RowBaseType, TableInputType, TableType} from './table';

type Tables<
    // require at least the input table type
    TableGeneric extends TableInputType<RowBaseType>
> = {[tableName: string]: TableGeneric};

type SharedDatabaseTypeInfo = {
    connection: ConnectionInfo;
    version?: number;
};

export type DatabaseType = {
    tables: Tables<TableType<RowBaseType>>;
} & SharedDatabaseTypeInfo;

export type DatabaseInputType = {
    tables: Tables<TableInputType<RowBaseType>>;
} & SharedDatabaseTypeInfo;

export function inferDatabase<DatabaseGeneric extends DatabaseInputType>(
    databaseInput: DatabaseGeneric,
) {
    /**
     * For some reason this keeps the types within the reduce happy and acting as they should
     */
    type TablesInput = {
        // Why does databaseInput.tables vs databaseInput['tables'] make a difference???? ¯\_(ツ)_/¯
        [TableName in keyof typeof databaseInput.tables]: Readonly<
            typeof databaseInput.tables[TableName] & ExtraTableInfoType
        >;
    };

    /**
     * If this isn't used for the output we lose the stricter typing for each table's `sampleRow`
     * that the generic gives us. We also want the output
     */
    type TablesOutput = {
        // Why does databaseInput.tables vs databaseInput['tables'] make a difference???? ¯\_(ツ)_/¯
        [TableName in keyof typeof databaseInput['tables']]: Readonly<
            typeof databaseInput['tables'][TableName] & ExtraTableInfoType
        >;
    };

    const finalizedTables: Readonly<TablesOutput> = getObjectTypedKeys(databaseInput.tables).reduce(
        (tableJoining, tableName) => {
            const table = databaseInput.tables[tableName];

            tableJoining[tableName] = {
                ...table,
                databaseConnection: databaseInput.connection,
                /*
                    typescript thinks that `tableName` can be a number even though the generic
                    defines it as only a string ¯\_(ツ)_/¯ 
                */
                tableName: String(tableName),
            };
            return tableJoining;
        },
        {} as TablesInput,
    ) as Readonly<TablesOutput>;

    const dbInfo: DeepReadonly<SharedDatabaseTypeInfo> = databaseInput;

    const combinedDatabase = {
        ...dbInfo,
        // override the tables property (though TypeScript doesn't think it exists yet)
        tables: finalizedTables,
    };

    return combinedDatabase as Readonly<typeof combinedDatabase>;
}
