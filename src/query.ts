import {Row, RowBaseType, TableType} from './table';

export function insertRows<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(table: TableGeneric, row: Row<TableGeneric>[]) {
    // implement here
    return true;
}

export function insertRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(table: TableGeneric, row: Row<TableGeneric>) {
    return insertRows(table, [row]);
}

export function updateRows<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(
    table: TableGeneric,
    selectRows: Partial<Row<TableGeneric>>[],
    updateRows: Partial<Row<TableGeneric>>[],
) {
    // implement here
    return true;
}

export function updateRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(table: TableGeneric, select: Partial<Row<TableGeneric>>, update: Partial<Row<TableGeneric>>) {
    return updateRows(table, [select], [update]);
}

export function deleteRows<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(table: TableGeneric, select: Partial<Row<TableGeneric>>[]) {
    // implement here
    return true;
}

export function deleteRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableType<RowGeneric>
>(table: TableGeneric, select: Partial<Row<TableGeneric>>) {
    return deleteRows(table, [select]);
}
