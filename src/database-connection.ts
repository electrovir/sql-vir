import {Connection, createConnection} from 'mysql2/promise';
import {
    DatabaseConnectionConfig,
    DatabaseConnectionInputConfig,
    mapDatabaseConfigToMysqlConfig,
    readConfigUser,
} from './database-config';
import {MySqlError} from './mysql-error';

export async function readUserAndCreateConnection(config: DatabaseConnectionInputConfig) {
    const upgradedConfig: DatabaseConnectionConfig = readConfigUser(config);
    const connection = await createDatabaseConnection(upgradedConfig);
    return {
        config: upgradedConfig,
        connection,
    };
}

export async function createDatabaseConnection(
    config: DatabaseConnectionConfig,
): Promise<Connection> {
    return createConnection(mapDatabaseConfigToMysqlConfig(config));
}

export async function connectToDatabase(config: DatabaseConnectionConfig): Promise<Connection> {
    try {
        const connection = await createDatabaseConnection(config);
        await connection.connect();
        return connection;
    } catch (error) {
        throw new MySqlError(error);
    }
}

export async function handleWithConnection<CallbackReturnGeneric>(
    inputConnection: Connection | undefined,
    connectionConfig: DatabaseConnectionInputConfig,
    callback: (
        connection: Connection,
        config: DatabaseConnectionConfig,
    ) => CallbackReturnGeneric | Promise<CallbackReturnGeneric>,
): Promise<CallbackReturnGeneric> {
    if (inputConnection) {
        const config = readConfigUser(connectionConfig);
        return await callback(inputConnection, config);
    } else {
        const {connection, config} = await readUserAndCreateConnection(connectionConfig);
        const result = await callback(connection, config);
        connection.end();
        return result;
    }
}
