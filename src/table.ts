import {formatJson, VirSqlError} from './virsql-error';

export type RowBaseType = {[key: string]: string | number | Date | undefined | null};
/**
 * Extract the row type from a table type
 */
export type Row<T extends {sampleRow: RowBaseType}> = T['sampleRow'];

export type TableInfoType<RowGeneric extends RowBaseType> = {
    sampleRow: RowGeneric;
    tableName: string;
    databaseName: string;
};

/**
 * Not necessary for row operations but ensures that "row" matches the expected row format for "table"
 */
export function inferDatabaseRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableInfoType<RowGeneric>
>(table: TableGeneric, row: Row<typeof table>) {
    return row;
}

/**
 * mostly for type inference
 */
export function inferTable<
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
