import {createTable} from './table';
import {deleteRow, insertRow, updateRow} from './query';
import {createDatabase} from './database';

const inputObject = {
    sampleRow: {
        lastName: 'Kenobi',
        age: 32,
        color: 'blue',
        thingie: 'purple',
    },
};

const testTable = createTable({database: 'test_db', tableName: 'test_table'}, inputObject);

function acceptNumber(input: number) {}
function acceptString(input: string) {}

//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

const database1 = createDatabase({
    connection: {
        host: 'localhost',
        user: 'not-a-real-user',
        password: 'do not store a password in your repo like this',
        databaseName: 'not a real database',
    },
    tables: {
        tableA: {
            sampleRow: {
                columnA1: 'hello there',
            },
        },
        tableB: {
            sampleRow: {
                columnB1: 4,
            },
        },
    },
});

acceptString(database1.tables.tableA.sampleRow.columnA1);
acceptNumber(database1.tables.tableB.sampleRow.columnB1);
insertRow(database1.tables.tableA, {woopsie: 'we done here'});

//
// =================================================================================
//
//                                    FAILURES
//
// =================================================================================
//
//                       everything below here SHOULD fail
//

insertRow(database1.tables.tableA, {who: 'we done here'});
