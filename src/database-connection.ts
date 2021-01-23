import {Connection, ConnectionOptions, createConnection} from 'mysql2/promise';
import {MySqlError} from './mysql-error';

export type DatabaseConnectionOptions = Omit<
    ConnectionOptions,
    'user' | 'password' | 'database' | 'host'
>;

/**
 * All the information needed to establish a connection with a database
 */
export type DatabaseConnectionConfig = {
    /**
     * usually just localhost
     */
    host: string;
    user: DatabaseUser;
    /**
     * Used for connecting to the database. Must match the database name in the system.
     */
    databaseName: string;
    options?: DatabaseConnectionOptions;
};

export type DatabaseUser = {
    username: string;
    /**
     * The plain text password for the given user on the current database.
     *
     * NEVER COMMIT THIS VALUE TO YOUR REPO. READ IT FROM AN ENVIRONMENT VARIABLE OR GIT IGNORED CONFIG FILE.
     */
    password: string;
};

export async function createDatabaseConnection(
    config: DatabaseConnectionConfig,
): Promise<Connection> {
    return createConnection(mapDatabaseConnectionToMysqlConnection(config));
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

export function mapDatabaseConnectionToMysqlConnection(
    connection: DatabaseConnectionConfig,
): ConnectionOptions {
    const connectionConfig: ConnectionOptions = {
        ...connection,
        ...connection.options,
        password: connection.user.password,
        user: connection.user.username,
        database: connection.databaseName,
    };

    // prevent mysql2 from complaining about an invalid config property
    delete ((connectionConfig as unknown) as Partial<DatabaseConnectionConfig>).databaseName;

    return connectionConfig;
}
