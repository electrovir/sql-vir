import {readFileSync} from 'fs';
import {compareObjectKeys} from './augments';
import {VirSqlError} from './virsql-error';

export const defaultUser: Required<DatabaseUser> = {
    username: '',
    password: '',
    domain: 'localhost',
} as const;

function isDatabaseUser(input: any): input is DatabaseUser {
    return compareObjectKeys(defaultUser, input);
}

export function readUserConfigFile(filePath: string): DatabaseUser {
    try {
        const fileContents = readFileSync(filePath).toString();
        try {
            const json = JSON.parse(fileContents);
            if (!('domain' in json)) {
                json.domain = defaultUser.domain;
            }
            if (isDatabaseUser(json)) {
                return json;
            } else {
                throw new VirSqlError(
                    `User config file has invalid format: ${json}\nIt should be: ${JSON.stringify(
                        defaultUser,
                    )}`,
                );
            }
        } catch (jsonError) {
            throw new VirSqlError(`Failed to parse user config file as JSON: ${jsonError}`);
        }
    } catch (readError) {
        throw new VirSqlError(`Failed to read user config file: ${readError}`);
    }
}

export type DatabaseUser = {
    username: string;
    /**
     * The plain text password for the given user on the current database.
     *
     * NEVER COMMIT THIS VALUE TO YOUR REPO. READ IT FROM AN ENVIRONMENT VARIABLE OR GIT IGNORED CONFIG FILE.
     */
    password: string;
    /**
     * domain is optional because it will get autofilled with 'localhost' if empty
     */
    domain?: string;
};
