import {formatJson, VirSqlError} from './virsql-error';

export type RowBaseType = {[key: string]: string | number | Date};

export type TableInfoType<RowGeneric extends RowBaseType> = {
    sampleRow: RowGeneric;
    tableName: string;
    databaseName: string;
};

/**
 * mostly for type inference
 */
export function createDatabaseTable<
    TableInfoGeneric extends {
        sampleRow: RowBaseType;
    }
>(
    {databaseName, tableName}: {databaseName: string; tableName: string},
    inputTable: TableInfoGeneric,
) {
    // the only thing I haven't worked out is how to prevent sampleRow being empty, so we'll check
    // that at run time here
    if (!Object.keys(inputTable.sampleRow).length) {
        throw new VirSqlError(
            `Table "${tableName} did not include a valid sampleRow:\n${formatJson(inputTable)}"`,
        );
    }

    return {
        ...inputTable,
        databaseName,
        tableName,
    };
}
