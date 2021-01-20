export type ConnectionInfo = {
    host: string;
    user: string;
    /**
     * The plain text password for the given user on the current database
     */
    password: string;
    /**
     * Used for connecting to the database. Must match the database name in the system.
     */
    databaseName: string;
};
