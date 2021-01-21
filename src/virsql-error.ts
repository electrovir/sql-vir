export class VirSqlError extends Error {
    public readonly name = 'VirSqlError';
}

/**
 * Errors thrown by the virsql layer before/after queries. Database operations themselves may still
 * throw errors.
 */
export function formatJson(input: any, indent = 1): string {
    const tabs = Array(indent)
        .fill(0)
        .map(() => '\t')
        .join('');

    return JSON.stringify(input, null, 4).split('\n').join(`${tabs}\n`);
}
