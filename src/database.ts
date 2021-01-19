import {getObjectTypedKeys} from './object';
import {RowBaseType, TableInputType, TableType} from './table';

export type ConnectionInfo = {
    host: string;
    user: string;
    /**
     * The plain text password for the given user on the current database
     */
    password: string;
    /**
     * Used for connecting to the database. Must match the database name in the system.
     */
    databaseName: string;
};

export type DatabaseType<
    RowGeneric extends RowBaseType,
    TablesGeneric extends {[tableName: string]: TableType<RowGeneric>}
> = {
    connection: ConnectionInfo;
    tables: TablesGeneric;
    version?: number;
};

type DatabaseInputType<
    RowGeneric extends RowBaseType,
    TablesGeneric extends {[tableName: string]: TableInputType<RowGeneric>}
> = {
    connection: ConnectionInfo;
    tables: TablesGeneric;
    version?: number;
};

export function createDatabase<
    RowGeneric extends RowBaseType,
    TablesGeneric extends {[tableName: string]: TableInputType<RowGeneric>}
>(databaseInput: DatabaseInputType<RowGeneric, TablesGeneric>) {
    // const finalizedDatabase = {
    //     connection: databaseInput.connection,
    //     tables: getObjectTypedKeys(databaseInput.tables).reduce((finalTables, tableName) => {
    //         finalTables[tableName] =-
    //         return finalTables;
    //     }, {} as TablesGeneric),
    // };

    return databaseInput;
}
