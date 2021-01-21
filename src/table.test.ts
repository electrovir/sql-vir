import {ConnectionInfo} from './connection';
import {insertRow, insertRows, deleteRow, deleteRows, updateRow, updateRows} from './query';
import {inferDatabaseRow, inferTable, RowBaseType, Row, TableType} from './table';

function testStringNarrowing(input: string) {
    return input;
}

const notJustStrings: RowBaseType = {
    maybeString: 'derp',
};

function testTableTypeAcceptance<RowGeneric extends RowBaseType>(input: TableType<RowGeneric>) {
    return input;
}

//
// =================================================================================
//
//                                    SUCCESSES
//
// =================================================================================
//

const inputObject = {
    sampleRow: {
        lastName: 'Kenobi',
        age: 32,
        color: 'blue',
        thingie: 'purple',
    },
};

const emptyConnectionInfo: ConnectionInfo = {} as ConnectionInfo;

const testTable = inferTable(
    {databaseConnection: emptyConnectionInfo, tableName: 'test_table'},
    inputObject,
);
// it is unfortunate but sampleRow may be an empty object
const emptyTable = inferTable(
    {databaseConnection: emptyConnectionInfo, tableName: 'test_table'},
    {sampleRow: {}},
);

// this should know that its type is narrowed to just string
testStringNarrowing(testTable.sampleRow.lastName);

// this should accept the test table without the test table being assigned specifically to that type
testTableTypeAcceptance(testTable);

const newRow = inferDatabaseRow(testTable, {
    lastName: 'Grievous',
    age: NaN,
    color: 'green',
    thingie: 'grey',
});
const newRow2: Row<typeof testTable> = {
    lastName: 'Skywalker',
    age: 16,
    color: 'blue',
    thingie: 'orange',
};
const shouldBeEmptyRow = inferDatabaseRow(emptyTable, {});
// if the table is defined with an empty  sampleRow then any row is accepted unfortunately
const shouldBeEmptyRow2 = inferDatabaseRow(emptyTable, {stuff: 'whatever'});

insertRow(testTable, {lastName: 'old value', thingie: 'what', color: 'blue', age: 44});

deleteRow(testTable, {lastName: 'old value'});

deleteRows(testTable, [{lastName: 'old value'}]);
updateRow(testTable, {lastName: 'old value'}, {lastName: 'new value'});
updateRows(testTable, [{lastName: 'old value'}], [{lastName: 'new value'}]);

//
// =================================================================================
//
//                                    FAILURES
//
// =================================================================================
//
//                       everything below here SHOULD fail
//

// this should be NOT valid
const invalidTable = inferTable(
    {databaseConnection: emptyConnectionInfo, tableName: 'test_table'},
    {
        sampleRow: {
            thingie: new RegExp(),
        },
    },
);
// this should be NOT valid
const invalidTable2 = inferTable(
    {databaseConnection: emptyConnectionInfo, tableName: 'test_table'},
    {},
);
// this should be NOT valid
const invalidTable3 = inferTable(
    {databaseConnection: emptyConnectionInfo, tableName: 'test_table'},
    {},
);

insertRow(testTable, {lastName: 'hello there'});
insertRows(testTable, [{lastName: 'we done here'}]);
insertRow(testTable, {lastName: 'old value'});

// should not be able to modify table data
testTable.sampleRow.age = 4;
testTable.sampleRow = inputObject.sampleRow;
testTable.database = 'failure';

// these should all fail
testTableTypeAcceptance({sampleRow: {}});
testTableTypeAcceptance({database: 'fail databsae', tableName: 'fail table'});
testTableTypeAcceptance(inputObject);
// this should fail because RowBaseType allows more than just strings
testStringNarrowing(notJustStrings.maybeString);
// new row without any properties

const shouldNotBeEmptyRow = inferDatabaseRow(testTable, {});
const newRowFail2: Row<typeof testTable> = {lastName: 'cushion'};
const newRowFail3 = inferDatabaseRow(testTable, {lastName: 'hoopla'});
