import {inferDatabaseRow, inferTable, RowBaseType, Row, TableInfoType} from './table';

function testStringNarrowing(input: string) {
    return input;
}

const notJustStrings: RowBaseType = {
    maybeString: 'derp',
};

function testTableTypeAcceptance<RowGeneric extends RowBaseType>(input: TableInfoType<RowGeneric>) {
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

const testTable = inferTable({databaseName: 'test_db', tableName: 'test_table'}, inputObject);

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
    {databaseName: 'test_db', tableName: 'test_table'},
    {
        sampleRow: {
            thingie: new RegExp(),
        },
    },
);
// this should be NOT valid
const invalidTable2 = inferTable({databaseName: 'test_db', tableName: 'test_table'}, {});
// this should be NOT valid
const invalidTable3 = inferTable({databaseName: 'test_db', tableName: 'test_table'}, {});

// these should all fail
testTableTypeAcceptance({sampleRow: {}});
testTableTypeAcceptance({databaseName: 'fail databsae', tableName: 'fail table'});
testTableTypeAcceptance(inputObject);
// this should fail because RowBaseType allows more than just strings
testStringNarrowing(notJustStrings.maybeString);

// new row without any properties
const newRowFail = inferDatabaseRow(testTable, {});
const newRowFail2: Row<typeof testTable> = {lastName: 'cushion'};
const newRowFail3 = inferDatabaseRow(testTable, {lastName: 'hoopla'});
