import {testGroup} from 'test-vir';
import {DatabaseConnectionConfig} from '../database-config';
import {connectToDatabase} from '../database-connection';
import {MySqlError} from '../mysql-error';

testGroup((runTest) => {
    const nonExistentDatabaseConfig: DatabaseConnectionConfig = {
        databaseName: 'Qrrbrbirlbel',
        host: 'localhost',
        user: {
            username: 'not a real user',
            password: 'not a real password',
            domain: 'localhost',
        },
    };

    runTest({
        expectError: {
            errorClass: MySqlError,
            errorMessage: /Error: Access denied for user.+/,
        },
        test: async () => {
            await connectToDatabase(nonExistentDatabaseConfig);
        },
    });
});
