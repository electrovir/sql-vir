import {createTable} from './table';
import {deleteRow, insertRow, updateRow} from './query';
import {ConnectionInfo} from './connection';

const inputObject = {
    sampleRow: {
        lastName: 'Kenobi',
        age: 32,
        color: 'blue',
        thingie: 'purple',
    },
};

// bad empty object so we just don't have to worry about this here
const dummyConnection: ConnectionInfo = {} as ConnectionInfo;

const testTable = createTable(
    {databaseConnection: dummyConnection, tableName: 'test_table'},
    inputObject,
);
const testTable2 = createTable(
    {databaseConnection: dummyConnection, tableName: 'test_table'},
    {
        sampleRow: {
            columnA1: 'hello there',
            columnA2: 'you are a bold one',
        },
    },
);

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
        databaseConnection: {} as ConnectionInfo,
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

insertRow(testTable, {lastName: 4});
updateRow(testTable, {hoopla: 'kenobi'}, {derp: 56});
updateRow(testTable, {lastName: 'kenobi'}, {derp: 56});
deleteRow(testTable, {derp: 'fjkdlsjfd'});
deleteRow(testTable2, {who: 'old value'});
