import {ConnectionInfo} from './connection';
import {getObjectTypedKeys} from './object';
import {createTable, ExtraTableInfoType, RowBaseType, TableInputType, TableType} from './table';

export type DatabaseType<
    RowGeneric extends RowBaseType,
    TablesGeneric extends {[tableName: string]: TableType<RowGeneric>}
> = {
    tables: TablesGeneric;
} & SharedDatabaseTypeInfo;

type SharedDatabaseTypeInfo = {
    connection: ConnectionInfo;
    version?: number;
};

type DatabaseInputType<
    RowGeneric extends RowBaseType,
    TablesGeneric extends {[tableName: string]: TableInputType<RowGeneric>}
> = {
    tables: TablesGeneric;
} & SharedDatabaseTypeInfo;

function fillOutTables<
    RowGeneric extends RowBaseType,
    TableNames extends string,
    TablesInputGeneric extends {[tableName in TableNames]: TableInputType<RowGeneric>}
>(tables: TablesInputGeneric, databaseConnection: ConnectionInfo) {
    return finalizedTables;
}

export function createDatabase<
    DatabaseGeneric extends {
        tables: {[key: string]: {sampleRow: RowBaseType}};
    } & SharedDatabaseTypeInfo
>(databaseInput: DatabaseGeneric) {
    return databaseInput;
    // return {
    //     ...dbInfo,
    //     tables: databaseInput.tables as typeof databaseInput['tables'] &
    //         {[key in TableNames]: ExtraTableInfoType},
    // };
}
