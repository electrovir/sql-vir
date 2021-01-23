export function getObjectTypedKeys<T extends object>(input: T): (keyof T)[] {
    return Object.keys(input) as (keyof T)[];
}

export type DeepReadonly<T> = {readonly [P in keyof T]: Readonly<T[P]>};

export function formatJson(input: any, indent = 1): string {
    const tabs = Array(indent)
        .fill(0)
        .map(() => '\t')
        .join('');

    return JSON.stringify(input, null, 4).split('\n').join(`${tabs}\n`);
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
