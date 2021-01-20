import {Row, RowBaseType, TableType} from './table';

export function insertRows<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    row: Row<typeof table>[],
) {
    // implement here
    return true;
}

export function insertRow<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    row: Required<Row<typeof table>>,
) {
    return insertRows(table, [row]);
}

export function updateRows<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    selectRows: Partial<Row<typeof table>>[],
    updateRows: Partial<Row<typeof table>>[],
) {
    // implement here
    return true;
}

export function readRows<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    select: Partial<Row<typeof table>>[],
) {
    // implement here
    return true;
}

export function readRow<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    select: Partial<Row<typeof table>>,
) {
    return readRows(table, [select]);
}

export function updateRow<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    select: Partial<Row<typeof table>>,
    update: Partial<Row<typeof table>>,
) {
    return updateRows(table, [select], [update]);
}

export function deleteRows<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    select: Partial<Row<typeof table>>[],
) {
    // implement here
    return true;
}

export function deleteRow<RowGeneric extends RowBaseType>(
    table: TableType<RowGeneric>,
    select: Partial<Row<typeof table>>,
) {
    return deleteRows(table, [select]);
}
