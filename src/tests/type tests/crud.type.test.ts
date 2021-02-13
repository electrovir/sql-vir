import {deleteRow, insertRow, updateRow} from '../../crud';
import {
    DatabaseConfigWithDatabaseName,
    defaultDatabaseConnectionConfig,
} from '../../database-config';
import {inferTable} from '../../table';

const inputObject = {
    sampleRow: {
        lastName: 'Kenobi',
        age: 32,
        color: 'blue',
        thingie: 'purple',
    },
};

const dummyConnection: DatabaseConfigWithDatabaseName = defaultDatabaseConnectionConfig;

const testTable = inferTable({
    databaseConnection: dummyConnection,
    tableName: 'test_table',
    ...inputObject,
});
const testTable2 = inferTable({
    sampleRow: {
        columnA1: 'hello there',
        columnA2: 'you are a bold one',
    },
    databaseConnection: dummyConnection,
    tableName: 'test_table',
});

//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

// success because the whole row is defined
insertRow(testTable, {lastName: 'Lars', age: 25, color: 'beige', thingie: 'orange'});
updateRow(testTable, {lastName: 'kahooka'}, {age: 56});
deleteRow(testTable, {lastName: 'fjkdlsjfd'});
insertRow(
    {
        sampleRow: {
            stats: 5,
        },
        databaseConnection: dummyConnection,
        tableName: 'test-table',
    },
    {stats: 63},
);

//
// =================================================================================
//
//                                    FAILURES
//
// =================================================================================
//
//                       everything below here SHOULD fail
//

// @ts-expect-error
insertRow(testTable, {lastName: 4});
// @ts-expect-error
updateRow(testTable, {hoopla: 'kenobi'}, {derp: 56});
// @ts-expect-error
updateRow(testTable, {lastName: 'kenobi'}, {derp: 56});
// @ts-expect-error
deleteRow(testTable, {derp: 'fjkdlsjfd'});
// @ts-expect-error
deleteRow(testTable2, {who: 'old value'});
