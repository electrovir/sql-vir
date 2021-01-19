import {inferDatabaseRow, createTable, RowBaseType, Row, TableType} from './table';

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

const testTable = createTable({database: 'test_db', tableName: 'test_table'}, inputObject);
// it is unfortunate but sampleRow may be an empty object
const emptyTable = createTable({database: 'test_db', tableName: 'test_table'}, {sampleRow: {}});

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
const invalidTable = createTable(
    {database: 'test_db', tableName: 'test_table'},
    {
        sampleRow: {
            thingie: new RegExp(),
        },
    },
);
// this should be NOT valid
const invalidTable2 = createTable({database: 'test_db', tableName: 'test_table'}, {});
// this should be NOT valid
const invalidTable3 = createTable({database: 'test_db', tableName: 'test_table'}, {});

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
