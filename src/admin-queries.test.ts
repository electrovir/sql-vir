import {createUser} from './admin-queries';

// npm run compile && node dist/admin-queries.test.js

async function main() {
    const createUserResult = await createUser(
        {
            host: 'localhost',
            user: {
                username: 'testUser',
                password: 'testUserPassword',
            },
        },
        {
            username: 'testUser',
            password: 'testUserPassword',
        },
    );

    console.log(createUserResult);
}

main().catch((error) => {
    console.error(error);
});
