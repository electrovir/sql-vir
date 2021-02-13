import {Connection} from 'mysql2/promise';
import {
    DatabaseConnectionInputConfig,
    DatabaseInputConfigWithDatabaseName,
    includesDatabaseName,
} from './database-config';
import {DatabaseUser, readUserConfigFile} from './database-user';
import {QueryResult, rawQuery} from './query';

/**
 * This merely creates a database. It does not populate it with any tables.
 */
export async function createDatabase(inputDatabase: DatabaseInputConfigWithDatabaseName) {
    return false;
}

export async function deleteDatabase(inputDatabase: DatabaseInputConfigWithDatabaseName) {
    return false;
}

export type UserQueryFunction = (
    connectionConfig: DatabaseConnectionInputConfig,
    operatedOnUserConfigFilePath: string,
    connection?: Readonly<Connection>,
) => Promise<QueryResult>;

/**
 * This will likely need to be called with root permissions.
 *
 * @param databaseConfig this config should contain the root user config, or the user that already
 *                       has permissions to create a new user
 * @param newUserConfigFilePath file path to the config for the new user
 */
export const createUser: UserQueryFunction = async (
    databaseConfig,
    newUserConfigFilePath,
    connection,
) => {
    const newUser: DatabaseUser = readUserConfigFile(newUserConfigFilePath);

    const result = await rawQuery(
        `create user ?@? identified by ?`,
        [newUser.username, newUser.domain, newUser.password],
        databaseConfig,
        connection,
    );

    if (includesDatabaseName(databaseConfig)) {
        await grantUserPermission(databaseConfig, newUser, connection);
    }

    return result;
};

export const deleteUser: UserQueryFunction = async (
    databaseConfig,
    userToDeleteConfigFilePath,
    connection,
) => {
    const userToDelete: DatabaseUser = readUserConfigFile(userToDeleteConfigFilePath);

    const result = await rawQuery(
        `drop user ?@?`,
        [userToDelete.username, userToDelete.domain],
        databaseConfig,
        connection,
    );

    return result;
};

export const searchForUser: UserQueryFunction = async (
    databaseConfig,
    userToSearchForConfigFilePath,
    connection,
) => {
    const userToSearchFor: DatabaseUser = readUserConfigFile(userToSearchForConfigFilePath);

    const result = await rawQuery(
        `select user from mysql.user where user = ?`,
        [userToSearchFor.username],
        databaseConfig,
        connection,
    );
    return result;
};

export async function grantUserPermission(
    databaseConfig: DatabaseInputConfigWithDatabaseName,
    userToGrantPrivileges: DatabaseUser,
    connection?: Connection,
): Promise<QueryResult> {
    const result = await rawQuery(
        `grant all privileges on ?.* to ?@?`,
        [databaseConfig.databaseName, userToGrantPrivileges.username, userToGrantPrivileges.domain],
        databaseConfig,
        connection,
    );
    return result;
}
