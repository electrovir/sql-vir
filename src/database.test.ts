import {deleteRow, insertRow, updateRow, deleteRows, insertRows, updateRows} from './query';
import {inferDatabase} from './database';

function acceptNumber(input: number) {}
function acceptString(input: string) {}

//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

const database1 = inferDatabase({
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
                columnA2: 'you are a bold one',
            },
        },
        tableB: {
            sampleRow: {
                columnB1: 4,
            },
        },
    },
});

// unfortunately an empty object is accepted for "tables" but that would make a useless database anyway
inferDatabase({
    connection: {
        host: 'localhost',
        user: 'not-a-real-user',
        password: 'do not store a password in your repo like this',
        databaseName: 'not a real database',
    },
    tables: {},
});

database1.tables.tableA;

acceptString(database1.tables.tableA.sampleRow.columnA1);
acceptNumber(database1.tables.tableB.sampleRow.columnB1);
insertRow(database1.tables.tableA, {columnA1: 'hello there', columnA2: 'hello'});
insertRow(database1.tables.tableB, {columnB1: 3});
insertRows(database1.tables.tableA, [{columnA1: 'we done here', columnA2: 'what'}]);
insertRow(database1.tables.tableA, {columnA1: 'old value', columnA2: 'oops'});

deleteRow(database1.tables.tableA, {columnA1: 'old value'});

deleteRows(database1.tables.tableA, [{columnA1: 'old value'}]);
updateRow(database1.tables.tableA, {columnA1: 'old value'}, {columnA1: 'new value'});
updateRows(database1.tables.tableA, [{columnA1: 'old value'}], [{columnA1: 'new value'}]);

//
// =================================================================================
//
//                                    FAILURES
//
// =================================================================================
//
//                       everything below here SHOULD fail
//

// should be readonly
database1.connection = database1.connection;
database1.tables = database1.tables;
database1.version = 5;
database1.tables.tableA = database1.tables.tableA;
database1.tables.tableA.sampleRow = database1.tables.tableA.sampleRow;
database1.tables.tableA.databaseConnection = database1.tables.tableA.databaseConnection;

acceptString(database1.tables.tableA.sampleRow.columnA0);
acceptString(database1.tables.tableB.sampleRow.columnB1);
acceptNumber(database1.tables.tableA.sampleRow.columnA1);
insertRow(database1.tables.tableA, {who: 'we done here'});
insertRows(database1.tables.tableA, [{who: 'we done here'}]);
insertRow(database1.tables.tableA, {who: 'old value'});
insertRow(database1.tables.tableA, {columnA1: 'hello there'});
deleteRow(database1.tables.tableA, {who: 'old value'});
updateRow(database1.tables.tableA, {who: 'old value'}, {who: 'new value'});
inferDatabase({});
inferDatabase({connection: {}, tables: {}});
