export function getObjectTypedKeys<T extends object>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

export type DeepReadonly<T> = {readonly [P in keyof T]: Readonly<T[P]>};
export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

export function formatJson<T>(input: T, indent = 1): string {
    const tabs = Array(indent)
        .fill(0)
        .map(() => '\t')
        .join('');

    return JSON.stringify(input, null, 4).split('\n').join(`${tabs}\n`);
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export function compareObjectKeys<T extends object>(
    correctObject: T,
    comparison: any,
    ignoreType = false,
): comparison is T {
    return !countMismatchedKeys(correctObject, comparison, ignoreType).length;
}

function countMismatchedKeys<T extends object>(
    correctObject: T,
    comparison: any,
    ignoreType: boolean | undefined,
): Error[] {
    if (typeof correctObject !== 'object') {
        return [new Error(`First input is not an object: ${correctObject}`)];
    }
    if (typeof comparison !== 'object') {
        return [new Error(`Second input is not an object: ${comparison}`)];
    }

    return getObjectTypedKeys(correctObject)
        .map((key) => {
            const hasKey = comparison.hasOwnProperty(key);
            if (!hasKey) {
                return new Error(`Second input is missing key: ${key}`);
            } else if (!ignoreType && typeof comparison[key] !== typeof correctObject[key]) {
                return new Error(
                    `Input type does not agree for key ${key}: ${typeof comparison[
                        key
                    ]} vs ${typeof correctObject[key]}`,
                );
            } else {
                return undefined;
            }
        })
        .filter((result): result is Error => !!result);
}

/**
 * Assert that all properties in correctObject are present in the comparison object and that their
 * values are of the same type. Fails if either input is not an object.
 *
 * Optionally the value checking can be ignored by passing true for ignoreType.
 */
export function assertObjectKeys<T extends object>(
    correctObject: T,
    comparison: any,
    ignoreType = false,
): asserts comparison is T {
    if (typeof correctObject !== 'object' || typeof comparison !== 'object') {
        throw new Error(`not an object`);
    }

    const errors: Error[] = countMismatchedKeys(correctObject, comparison, ignoreType);

    if (errors.length > 1) {
        const errorMessage = errors
            .map((error) => {
                return `\t${error.message}`;
            })
            .join('\n');
        throw new Error(`property errors:\n${errorMessage}`);
    } else if (errors.length) {
        throw errors[0];
    }
}
