import {createDatabaseTable, RowBaseType, TableInfoType} from './database';

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

const testTable = createDatabaseTable(
    {databaseName: 'test_db', tableName: 'test_table'},
    {
        sampleRow: {
            lastName: 'Kenobi',
            age: 32,
            color: 'blue',
            thingie: 'purple',
        },
    },
);

// this should know that its type is narrowed to just string
testStringNarrowing(testTable.sampleRow.lastName);

// this should accept the test table without the test table being assigned specifically to that type
testTableTypeAcceptance(testTable);

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
const invalidTable = createDatabaseTable(
    {databaseName: 'test_db', tableName: 'test_table'},
    {
        sampleRow: {
            thingie: new RegExp(),
        },
    },
);
// this should be NOT valid
const invalidTable2 = createDatabaseTable({databaseName: 'test_db', tableName: 'test_table'}, {});
// this should be NOT valid
const invalidTable3 = createDatabaseTable({databaseName: 'test_db', tableName: 'test_table'}, {});

// these should all fail
testTableTypeAcceptance({sampleRow: {}});
testTableTypeAcceptance({databaseName: 'fail databsae', tableName: 'fail table'});
// this should fail because RowBaseType allows more than just strings
testStringNarrowing(notJustStrings.maybeString);
