import {join, resolve} from 'path';

const keysDir = resolve(__dirname, '../', '../', 'keys');

export const UserConfigFiles = {
    root: join(keysDir, 'root-mysql.private.json'),
    testUser: join(keysDir, 'test-user-mysql.private.json'),
} as const;
