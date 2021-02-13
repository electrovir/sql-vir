import {deleteRow, deleteRows, insertRow, insertRows, updateRow, updateRows} from '../../crud';
import {DatabaseConfigWithDatabaseName} from '../../database-config';
import {inferTable, inferTableRow, Row, RowBaseType, TableType} from '../../table';

function testStringNarrowing(input: string) {
    return input;
}

const notJustStrings: RowBaseType = {
    maybeString: 'derp',
};

function testTableTypeAcceptance(input: TableType) {
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

const emptyConnectionInfo: DatabaseConfigWithDatabaseName = {
    user: {username: '', password: '', domain: ''},
    databaseName: '',
    host: '',
};

const connection = {databaseConnection: emptyConnectionInfo, tableName: 'test_table'};

const testTable = inferTable({...connection, ...inputObject});
// it is unfortunate but sampleRow may be an empty object
const emptyTable = inferTable({sampleRow: {}, ...connection});

// this should know that its type is narrowed to just string
testStringNarrowing(testTable.sampleRow.lastName);

// this should accept the test table without the test table being assigned specifically to that type
testTableTypeAcceptance(testTable);

const newRow = inferTableRow(testTable, {
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
const shouldBeEmptyRow = inferTableRow(emptyTable, {});
// if the table is defined with an empty  sampleRow then any row is accepted unfortunately
const shouldBeEmptyRow2 = inferTableRow(emptyTable, {stuff: 'whatever'});

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
const invalidTable = inferTable({
    sampleRow: {
        // @ts-expect-error
        thingie: new RegExp(),
    },
    databaseConnection: emptyConnectionInfo,
    tableName: 'test_table',
});
// this should be NOT valid
// @ts-expect-error
const invalidTable2 = inferTable({
    databaseConnection: emptyConnectionInfo,
    tableName: 'test_table',
});
// this should be NOT valid
const invalidTable3 = inferTable({
    databaseConnection: emptyConnectionInfo,
    tableName: 'test_table',
    // @ts-expect-error
    sampleRow: 'derp',
});

// @ts-expect-error
insertRow(testTable, {lastName: 'hello there'});
// @ts-expect-error
insertRows(testTable, [{lastName: 'we done here'}]);
// @ts-expect-error
insertRow(testTable, {lastName: 'old value'});

// should not be able to modify table data
// @ts-expect-error
testTable.sampleRow.age = 4;
// @ts-expect-error
testTable.sampleRow = inputObject.sampleRow;
// @ts-expect-error
testTable.database = 'failure';

// these should all fail
// @ts-expect-error
testTableTypeAcceptance({sampleRow: {}});
// @ts-expect-error
testTableTypeAcceptance({database: 'fail databsae', tableName: 'fail table'});
// @ts-expect-error
testTableTypeAcceptance(inputObject);
// this should fail because RowBaseType allows more than just strings
// @ts-expect-error
testStringNarrowing(notJustStrings.maybeString);

// new row without any properties
// @ts-expect-error
const shouldNotBeEmptyRow = inferTableRow(testTable, {});
// @ts-expect-error
const newRowFail2: Row<typeof testTable> = {lastName: 'cushion'};
// @ts-expect-error
const newRowFail3 = inferTableRow(testTable, {lastName: 'hoopla'});
