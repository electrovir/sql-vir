import {Connection, createConnection} from 'mysql';
import {DatabaseType} from './database';

export function rawQuery() {
    return false;
}

export function createDatabaseConnection(database: DatabaseType): Connection {
    return createConnection(database.connection);
}
