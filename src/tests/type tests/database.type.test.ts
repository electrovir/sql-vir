import {deleteRow, deleteRows, insertRow, insertRows, updateRow, updateRows} from '../../crud';
import {inferDatabase} from '../../database';

// for testing types later in the file
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
        userConfigFile: 'fake path to config file',
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
        userConfigFile: 'fake path to config file',
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
// @ts-expect-error
database1.connection = database1.connection;
// @ts-expect-error
database1.tables = database1.tables;
// @ts-expect-error
database1.version = 5;
// @ts-expect-error
database1.tables.tableA = database1.tables.tableA;
// @ts-expect-error
database1.tables.tableA.sampleRow = database1.tables.tableA.sampleRow;
// @ts-expect-error
database1.tables.tableA.databaseConnection = database1.tables.tableA.databaseConnection;

// @ts-expect-error
acceptString(database1.tables.tableA.sampleRow.columnA0);
// @ts-expect-error
acceptString(database1.tables.tableB.sampleRow.columnB1);
// @ts-expect-error
acceptNumber(database1.tables.tableA.sampleRow.columnA1);
// @ts-expect-error
insertRow(database1.tables.tableA, {who: 'we done here'});
// @ts-expect-error
insertRows(database1.tables.tableA, [{who: 'we done here'}]);
// @ts-expect-error
insertRow(database1.tables.tableA, {who: 'old value'});
// @ts-expect-error
insertRow(database1.tables.tableA, {columnA1: 'hello there'});
// @ts-expect-error
deleteRow(database1.tables.tableA, {who: 'old value'});
// @ts-expect-error
updateRow(database1.tables.tableA, {who: 'old value'}, {who: 'new value'});
// @ts-expect-error
inferDatabase({});
// @ts-expect-error
inferDatabase({connection: {}, tables: {}});
