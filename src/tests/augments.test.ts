import {testGroup} from 'test-vir';
import {assertObjectKeys, compareObjectKeys} from '../augments';

testGroup((runTest) => {
    const testCases: {expect: boolean; objects: [object, object]}[] = [
        {
            expect: true,
            objects: [{}, {}],
        },
        {
            expect: false,
            objects: [{hasKey: 'something'}, {}],
        },
        {
            expect: false,
            objects: [{otherKey: 'other'}, {hasKey: 'something'}],
        },
        {
            expect: true,
            objects: [{hasKey: 'property value no matter'}, {hasKey: 'only property type'}],
        },
    ];

    testCases.forEach((testCase, index) => {
        const description = `${JSON.stringify(testCase.objects[0])} and ${JSON.stringify(
            testCase.objects[1],
        )} should ${testCase.expect ? '' : 'not'} match`;
        runTest({
            description: `(${index}) compare that ${description}`,
            expect: testCase.expect,
            test: () => compareObjectKeys(...testCase.objects),
        });
        runTest({
            description: `(${index}) assert that ${description}${
                testCase.expect ? '' : ' and throw an error'
            }`,
            expectError: testCase.expect ? undefined : {errorClass: Error},
            test: () => assertObjectKeys(...testCase.objects),
        });
    });
});
