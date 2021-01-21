import {DatabaseConnectionInfo, DatabaseConnectionOptions} from './database-connection';

//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

const connectionThingie: DatabaseConnectionInfo = {
    host: 'localhost',
    user: {
        username: 'test user',
        password: 'not a real password',
    },
    databaseName: 'testDatabase',
};

const connectionWithOptions: DatabaseConnectionInfo = {
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
    user: 'should not allow user property',
};
const options1: DatabaseConnectionOptions = {
    password: 'should not allow password property',
};
const options2: DatabaseConnectionOptions = {
    database: 'should not allow database property',
};
const options3: DatabaseConnectionOptions = {
    host: 'should not allow host property',
};
