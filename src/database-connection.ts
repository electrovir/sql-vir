/**
 * All the information needed to establish a connection with a database
 */
export type DatabaseConnectionInfo = {
    host: string;
    user: string;
    /**
     * The plain text password for the given user on the current database.
     *
     * NEVER COMMIT THIS VALUE TO YOUR REPO. READ IT FROM AN ENVIRONMENT VARIABLE OR GIT IGNORED CONFIG FILE.
     */
    password: string;
    /**
     * Used for connecting to the database. Must match the database name in the system.
     */
    databaseName: string;
};
