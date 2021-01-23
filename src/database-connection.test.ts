import {connectToDatabase, DatabaseConnectionConfig} from './database-connection';
import {MySqlError} from './mysql-error';

// npm run compile && node dist/database-connection.test.js

const nonExistentDatabaseConfig: DatabaseConnectionConfig = {
    databaseName: 'Qrrbrbirlbel',
    host: 'localhost',
    user: {
        username: 'not a real user',
        password: 'not a real password',
    },
};

async function main() {
    try {
        await connectToDatabase(nonExistentDatabaseConfig);
    } catch (error) {
        if (
            error instanceof MySqlError &&
            error.message.includes(
                `Error: Access denied for user '${nonExistentDatabaseConfig.user.username}'@` +
                    `'${nonExistentDatabaseConfig.host}' (using password: YES)`,
            )
        ) {
            console.log('success!');
        } else {
            console.log('failure!');
        }
        throw error;
    }
}

main().catch((error) => {
    console.error(error);
});
