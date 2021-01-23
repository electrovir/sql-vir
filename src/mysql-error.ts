/**
 * Errors thrown by the MySQL layer during queries, connections, database operations, etc.
 */
export class MySqlError extends Error {
    public readonly name = 'MySqlError';
}
