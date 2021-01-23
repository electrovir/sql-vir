import {PartialBy} from './augments';
import {connectToDatabase, DatabaseConnectionConfig, DatabaseUser} from './database-connection';

export function createDatabase(inputDatabase: DatabaseConnectionConfig): boolean {
    return false;
}

export function deleteDatabase(inputDatabase: DatabaseConnectionConfig): boolean {
    return false;
}

/**
 * This will likely need to be called with root permissions.
 */
export async function createUser(
    databaseConfig: Readonly<PartialBy<DatabaseConnectionConfig, 'databaseName'>>,
    newUser: Readonly<DatabaseUser>,
) {
    const connection = await connectToDatabase(databaseConfig as DatabaseConnectionConfig);
    const result = await connection.execute(`CREATE USER ${'fdsa'}`, []);

    if (databaseConfig.databaseName) {
        await grantUserPermission(databaseConfig as DatabaseConnectionConfig);
    }

    return result;
}

export async function grantUserPermission(
    databaseConfig: DatabaseConnectionConfig,
): Promise<boolean> {
    return false;
}
