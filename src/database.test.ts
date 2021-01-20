import {createTable, Row} from './table';
import {deleteRow, insertRow, updateRow, deleteRows, insertRows, updateRows} from './query';
import {createDatabase} from './database';
import {ConnectionInfo} from './connection';

const inputObject = {
    sampleRow: {
        lastName: 'Kenobi',
        age: 32,
        color: 'blue',
        thingie: 'purple',
    },
};

const testTable = createTable(
    {databaseConnection: {} as ConnectionInfo, tableName: 'test_table'},
    inputObject,
);

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
createDatabase({
    connection: {
        host: 'localhost',
        user: 'not-a-real-user',
        password: 'do not store a password in your repo like this',
        databaseName: 'not a real database',
    },
    tables: {},
});

type thing = Row<typeof database1.tables.tableA>;

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

insertRow(database1.tables.tableA, {who: 'we done here'});
insertRows(database1.tables.tableA, [{who: 'we done here'}]);
insertRow(database1.tables.tableA, {who: 'old value'});
deleteRow(database1.tables.tableA, {who: 'old value'});
updateRow(database1.tables.tableA, {who: 'old value'}, {who: 'new value'});
createDatabase({});
createDatabase({connection: {}, tables: {}});
