import {ConnectionConfig} from 'mysql';

export type DatabaseConnectionOptions = Omit<
    ConnectionConfig,
    'user' | 'password' | 'database' | 'host'
>;

/**
 * All the information needed to establish a connection with a database
 */
export type DatabaseConnectionInfo = {
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
