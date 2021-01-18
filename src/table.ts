import {formatJson, VirSqlError} from './virsql-error';

export type RowBaseType = Readonly<{[key: string]: string | number | Date | undefined | null}>;
/**
 * Extract the row type from a table type
 */
export type Row<T extends {sampleRow: RowBaseType}> = Readonly<T['sampleRow']>;

export type JustRowTable<RowGeneric extends RowBaseType> = Readonly<{
    sampleRow: Readonly<RowGeneric>;
}>;

type ExtraTableInfoType = Readonly<{databaseName: string; tableName: string}>;

export type TableType<RowGeneric extends RowBaseType> = Readonly<
    JustRowTable<Readonly<RowGeneric>>
> &
    Readonly<ExtraTableInfoType>;

/**
 * used to type check ONLY, in case that the db type checking is desired without using the full db
 * operations suite that this package provides.
 *
 * Includes run time checks to verify that the row has the exact interface as the expected row as
 * defined by the input table.
 */
export function checkRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends JustRowTable<RowGeneric>
>(table: TableGeneric, row: RowBaseType): row is Row<typeof table> {
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
export function inferTable<
    RowGeneric extends RowBaseType,
    TableGeneric extends JustRowTable<Readonly<RowGeneric>>
>(info: Readonly<ExtraTableInfoType>, inputTable: Readonly<TableGeneric>) {
    // the only thing I haven't worked out is how to prevent sampleRow being empty, so we'll check
    // that at run time here
    if (!Object.keys(inputTable.sampleRow).length) {
        throw new VirSqlError(
            `Table "${info.tableName} did not include a valid sampleRow:\n${formatJson(
                inputTable,
            )}"`,
        );
    }

    const finishedTable = {
        ...inputTable,
        databaseName: info.databaseName,
        tableName: info.tableName,
    };

    return finishedTable as Readonly<typeof inputTable & typeof info>;
}
