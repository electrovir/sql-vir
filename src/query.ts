import {Row, TableType} from './table';

export function insertRows<TableGeneric extends TableType>(
    table: TableGeneric,
    row: Row<typeof table>[],
) {
    // implement here
    return true;
}

export function insertRow<TableGeneric extends TableType>(
    table: TableGeneric,
    row: Required<Row<typeof table>>,
) {
    return insertRows(table, [row]);
}

export function updateRows<TableGeneric extends TableType>(
    table: TableGeneric,
    selectRows: Partial<Row<typeof table>>[],
    updateRows: Partial<Row<typeof table>>[],
) {
    // implement here
    return true;
}

export function readRows<TableGeneric extends TableType>(
    table: TableGeneric,
    select: Partial<Row<typeof table>>[],
) {
    // implement here
    return true;
}

export function readRow<TableGeneric extends TableType>(
    table: TableGeneric,
    select: Partial<Row<typeof table>>,
) {
    return readRows(table, [select]);
}

export function updateRow<TableGeneric extends TableType>(
    table: TableGeneric,
    select: Partial<Row<typeof table>>,
    update: Partial<Row<typeof table>>,
) {
    return updateRows(table, [select], [update]);
}

export function deleteRows<TableGeneric extends TableType>(
    table: TableGeneric,
    select: Partial<Row<typeof table>>[],
) {
    // implement here
    return true;
}

export function deleteRow<TableGeneric extends TableType>(
    table: TableGeneric,
    select: Partial<Row<typeof table>>,
) {
    return deleteRows(table, [select]);
}
