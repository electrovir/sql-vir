import {inferTable} from './table';
import {deleteRow, insertRow, updateRow} from './query';

const inputObject = {
    sampleRow: {
        lastName: 'Kenobi',
        age: 32,
        color: 'blue',
        thingie: 'purple',
    },
};

const testTable = inferTable({databaseName: 'test_db', tableName: 'test_table'}, inputObject);

//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

// success because the whole row is defined
insertRow(testTable, {lastName: 'Lars', age: 25, color: 'beige', thingie: 'orange'});
updateRow(testTable, {lastName: 'kenobi'}, {age: 56});
deleteRow(testTable, {lastName: 'fjkdlsjfd'});

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
