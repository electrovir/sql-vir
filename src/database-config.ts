import {ConnectionOptions} from 'mysql2/promise';
import {compareObjectKeys, Mutable, RequiredBy} from './augments';
import {DatabaseUser, defaultUser, readUserConfigFile} from './database-user';

export const defaultDatabaseConnectionConfig: DatabaseConfigWithDatabaseName = {
    host: defaultUser.domain,
    databaseName: '',
    user: defaultUser,
} as const;

export type DatabaseConnectionOptions = Omit<
    ConnectionOptions,
    'user' | 'password' | 'database' | 'host'
>;

/**
 * All the information needed to create the database object
 */
export type DatabaseConnectionInputConfig = Readonly<{
    /**
     * usually just localhost
     */
    host: string;
    userConfigFile: string;
    /**
     * Used for connecting to the database. Must match the database name in the system.
     */
    databaseName?: string;
    options?: DatabaseConnectionOptions;
}>;

/**
 * All the information needed to establish a connection with a database in mysql.
 * Compared to the above DatabaseConnectionInputConfig type, this has the user config file parsed
 * into the user property.
 */
export type DatabaseConnectionConfig = Readonly<
    Omit<DatabaseConnectionInputConfig, 'userConfigFile'> & {
        user: DatabaseUser;
    }
>;

export type DatabaseInputConfigWithDatabaseName = Readonly<
    RequiredBy<DatabaseConnectionInputConfig, 'databaseName'>
>;

export type DatabaseConfigWithDatabaseName = Readonly<
    RequiredBy<DatabaseConnectionConfig, 'databaseName'>
>;

export function readConfigUser(
    input: DatabaseConnectionInputConfig | DatabaseConnectionConfig,
): DatabaseConnectionConfig {
    if ('user' in input) {
        return input;
    } else {
        const upgraded: DatabaseConnectionConfig = {
            host: input.host,
            databaseName: input.databaseName,
            options: input.options,
            user: readUserConfigFile(input.userConfigFile),
        };

        return upgraded;
    }
}

export function includesDatabaseName(
    input: DatabaseConnectionInputConfig,
): input is DatabaseInputConfigWithDatabaseName;
export function includesDatabaseName(
    input: DatabaseConnectionConfig,
): input is DatabaseConfigWithDatabaseName;
export function includesDatabaseName(
    input: DatabaseConnectionConfig | DatabaseConnectionInputConfig,
): input is DatabaseConfigWithDatabaseName | DatabaseConfigWithDatabaseName {
    return 'databaseName' in input && input.databaseName != undefined;
}

export function isFullDatabaseConnectionConfig(
    input: any,
    excludeDatabaseName?: false | undefined,
): input is DatabaseConfigWithDatabaseName;
export function isFullDatabaseConnectionConfig(
    input: any,
    excludeDatabaseName: true,
): input is DatabaseConnectionConfig;
export function isFullDatabaseConnectionConfig(
    input: any,
    excludeDatabaseName = false,
): input is DatabaseConnectionConfig {
    const comparison = {...defaultDatabaseConnectionConfig};
    if (excludeDatabaseName) {
        delete (comparison as Mutable<DatabaseConnectionConfig>).databaseName;
    }
    return compareObjectKeys(comparison, input);
}

export function mapDatabaseConfigToMysqlConfig(
    connection: DatabaseConnectionConfig,
): ConnectionOptions {
    const connectionConfig: ConnectionOptions = {
        host: connection.host,
        ...connection.options,
        password: connection.user.password,
        user: connection.user.username,
        database: connection.databaseName,
    };

    return connectionConfig;
}
