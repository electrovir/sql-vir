import {DatabaseConnectionConfig, DatabaseConnectionOptions} from '../../database-config';
//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

const connectionThingie: DatabaseConnectionConfig = {
    host: 'localhost',
    user: {
        username: 'test user',
        password: 'not a real password',
        domain: '',
    },
    databaseName: 'testDatabase',
};

const connectionWithOptions: DatabaseConnectionConfig = {
    ...connectionThingie,
    options: {
        port: 404,
    },
};

//
// =================================================================================
//
//                                    FAILURES
//
// =================================================================================
//
//                       everything below here SHOULD fail
//

const options: DatabaseConnectionOptions = {
    // @ts-expect-error
    user: 'should not allow user property',
};
const options1: DatabaseConnectionOptions = {
    // @ts-expect-error
    password: 'should not allow password property',
};
const options2: DatabaseConnectionOptions = {
    // @ts-expect-error
    database: 'should not allow database property',
};
const options3: DatabaseConnectionOptions = {
    // @ts-expect-error
    host: 'should not allow host property',
};
