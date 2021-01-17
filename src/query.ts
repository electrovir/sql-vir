import {RowBaseType, TableInfoType} from './database';

export function insertRow<
    RowGeneric extends RowBaseType,
    TableGeneric extends TableInfoType<RowGeneric>
>(table: TableGeneric, row: RowGeneric) {
    return true;
}

export function updateRows() {}
