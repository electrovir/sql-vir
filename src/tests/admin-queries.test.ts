import {testGroup} from 'test-vir';
import {
    createDatabase,
    createUser,
    deleteDatabase,
    deleteUser,
    searchForUser,
} from '../admin-queries';
import {
    DatabaseConnectionInputConfig,
    DatabaseInputConfigWithDatabaseName,
} from '../database-config';
import {UserConfigFiles} from './user-config-files';

testGroup((runTest) => {
    const hostUserConfig: DatabaseConnectionInputConfig = {
        host: 'localhost',
        userConfigFile: UserConfigFiles.root,
    };

    const userQueryInputs = [hostUserConfig, UserConfigFiles.testUser] as const;

    const databaseConfig: DatabaseInputConfigWithDatabaseName = {
        ...hostUserConfig,
        databaseName: 'test-database',
    };

    // this succeeds as long as it doesn't throw an error
    runTest({
        description: 'users can be created',
        test: async () => {
            try {
                await createUser(...userQueryInputs);
            } finally {
                await deleteUser(...userQueryInputs);
            }
        },
    });

    runTest({
        description: 'databases can be created',
        test: async () => {
            try {
                await createDatabase(databaseConfig);
            } finally {
                await deleteDatabase(databaseConfig);
            }
        },
    });

    runTest({
        description: 'test-user should not exist',
        expect: 0,
        test: async () => {
            return (await searchForUser(...userQueryInputs)).result[0].length;
        },
    });

    runTest({
        description: 'search for user after creating one',
        expect: 1,
        test: async () => {
            try {
                await createUser(...userQueryInputs);
                return (await searchForUser(...userQueryInputs)).result[0].length;
            } finally {
                await deleteUser(...userQueryInputs);
            }
        },
    });

    runTest({
        description: 'search for user after deleting one',
        expect: 0,
        test: async () => {
            try {
                await createUser(...userQueryInputs);
            } finally {
                await deleteUser(...userQueryInputs);
                return (await searchForUser(...userQueryInputs)).result[0].length;
            }
        },
    });
});
