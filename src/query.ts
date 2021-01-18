import {Row, RowBaseType, TableInfoType} from './table';

export function insertRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableInfoType<RowGeneric>
>(table: TableGeneric, row: Row<TableGeneric>) {
    // implement here
    return true;
}

export function updateRows<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableInfoType<RowGeneric>
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
    TableGeneric extends TableInfoType<RowGeneric>
>(table: TableGeneric, select: Partial<Row<TableGeneric>>, update: Partial<Row<TableGeneric>>) {
    // implement here
    return true;
}
