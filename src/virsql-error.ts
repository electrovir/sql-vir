/**
 * Errors thrown by the virsql layer before/after queries. Database operations themselves may still
 * throw errors.
 */
export class VirSqlError extends Error {
    public readonly name = 'VirSqlError';
}
