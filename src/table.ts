import {ConnectionInfo} from './connection';
import {formatJson, VirSqlError} from './virsql-error';

export type RowBaseType = Readonly<{
    [columnName: string]: string | number | Date | undefined | null;
}>;
/**
 * Extract the row type from a table type
 */
export type Row<T extends {sampleRow: RowBaseType}> = T['sampleRow'];

export type TableInputType<RowGeneric extends RowBaseType> = Readonly<{
    sampleRow: RowGeneric;
}>;

export type ExtraTableInfoType = Readonly<{databaseConnection: ConnectionInfo; tableName: string}>;

export type TableType<RowGeneric extends RowBaseType> = TableInputType<RowGeneric> &
    ExtraTableInfoType;

/**
 * used to type check ONLY, in case that the db type checking is desired without using the full db
 * operations suite that this package provides.
 *
 * Includes run time checks to verify that the row has the exact interface as the expected row as
 * defined by the input table.
 */
export function checkRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableInputType<RowGeneric>
>(table: Readonly<TableGeneric>, row: Readonly<RowBaseType>): row is Row<typeof table> {
    // check that row has all of table's expected keys
    if (!Object.keys(table.sampleRow).every((tableKey) => row.hasOwnProperty(tableKey))) {
        return false;
    }
    // check that row doesn't have any extra keys
    if (!Object.keys(row).every((rowKey) => table.sampleRow.hasOwnProperty(rowKey))) {
        return false;
    }
    return true;
}

/**
 * Not necessary for row operations but ensures that the input "row" matches the expected row format
 * for the input "table". The row is then returned so it can be used.
 */
export function inferDatabaseRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(table: Readonly<TableGeneric>, row: Readonly<Row<typeof table>>) {
    return row;
}

/**
 * mostly for type inference
 */
export function createTable<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableInputType<RowGeneric>
>(info: ExtraTableInfoType, inputTable: Readonly<TableGeneric>) {
    /*
        The only thing I haven't worked out is how to prevent the types from allowing 
        inputTable.sampleRow as an empty object {}, so we'll do a quick check for properties here
        at run time.
    */
    if (!Object.keys(inputTable.sampleRow).length) {
        throw new VirSqlError(
            `Table "${info.tableName} did not include a valid sampleRow:\n${formatJson(
                inputTable,
            )}"`,
        );
    }

    const finishedTable = {
        ...inputTable,
        databaseConnection: info.databaseConnection,
        tableName: info.tableName,
    };

    return finishedTable as typeof inputTable & typeof info;
}
