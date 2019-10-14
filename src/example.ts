import DataBase from './';
import seed from './seed/tablesUsersAndPosts';

const db = new DataBase();

seed().then(async () => {
    const rows = await db
        .table("users")
        .where({
            id: 1,
            username: 'rs-hub'
        })
        .select(["id", "username"])
        .limit(1)
        .skip(1);

    console.log(rows)
});
