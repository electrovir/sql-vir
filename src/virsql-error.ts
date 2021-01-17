export class VirSqlError extends Error {
    public readonly name = 'VirSqlError';
}

export function formatJson(input: any, tabLength = 1): string {
    const tabs = Array(tabLength)
        .fill(0)
        .map(() => '\t')
        .join('');

    return JSON.stringify(input, null, 4).split('\n').join(`${tabs}\n`);
}
