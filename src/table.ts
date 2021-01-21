import {DeepReadonly} from './augments';
import {DatabaseConnectionInfo} from './database-connection';
import {formatJson, VirSqlError} from './virsql-error';

/**
 * All accepted data types for row cells.
 */
export type AllowedTypes = string | number | Date | undefined | null;

/**
 * Base type for rows in tables
 */
export type RowBaseType = {
    [columnName: string]: AllowedTypes;
};

/**
 * Extract the row type from a table
 */
export type Row<TableGeneric extends TableInputType> = TableGeneric['sampleRow'];

/**
 * Minimal table type that is sufficient for defining tables within a database object. Included in
 * the final table type.
 */
export type TableInputType = Readonly<{
    sampleRow: Readonly<RowBaseType>;
}>;

/**
 * Data needed for performing database queries with the table.
 */
export type TableConnectionType = {databaseConnection: DatabaseConnectionInfo; tableName: string};

/**
 * Full Table type including sample row for type checking and connection info required for
 * performing database queries.
 */
export type TableType = TableInputType & TableConnectionType;

/**
 * used to type check ONLY, in case that the db type checking is desired without using the full db
 * operations suite that this package provides.
 *
 * Includes run time checks to verify that the row has the exact interface as the expected row as
 * defined by the input table.
 *
 * @param  table         the table to check the row against
 * @param  row           the row to check against the table
 * @param  allowPartial  Optional. Defaults to false. If true, the row is allowed to be missing keys.
 */
export function checkRow<TableGeneric extends TableInputType>(
    table: Readonly<TableGeneric>,
    row: Readonly<RowBaseType>,
    allowPartial = false,
): row is Readonly<Row<typeof table>> {
    // check that row doesn't have any extra keys
    if (!Object.keys(row).every((rowKey) => table.sampleRow.hasOwnProperty(rowKey))) {
        return false;
    }
    if (!allowPartial) {
        // check that row has all of table's expected keys
        if (!Object.keys(table.sampleRow).every((tableKey) => row.hasOwnProperty(tableKey))) {
            return false;
        }
    }
    return true;
}

/**
 * Not necessary for row operations but ensures that the input "row" matches the expected row format
 * for the input "table". The row is then returned so it can be used.
 */
export function inferTableRow<TableGeneric extends TableType>(
    table: Readonly<TableGeneric>,
    row: Readonly<Row<typeof table>>,
) {
    return row;
}

/**
 * Infer the table generic while still ensuring the table matches the correct data format for tables.
 */
export function inferTable<TableGeneric extends TableType>(inputTable: Readonly<TableGeneric>) {
    /*
        The only thing I haven't worked out is how to prevent the types from allowing 
        inputTable.sampleRow as an empty object {}, so we'll do a quick check for properties here
        at run time.
    */
    if (!Object.keys(inputTable.sampleRow).length) {
        throw new VirSqlError(
            `Table "${inputTable.tableName} did not include a valid sampleRow:\n${formatJson(
                inputTable,
            )}"`,
        );
    }

    return inputTable as DeepReadonly<typeof inputTable>;
}
