import DataBase from './';
import seed from './seed/tablesUsersAndPosts';

const db = new DataBase();

seed().then(async () => {
    const user = await db
        .select({
            username: 'rs-hub'
        })
        .table("users")
        .column(["id", "username"])
        .limit(1)
        .skip(1);
    console.log('select user =>', user[0].id, user[0].username);


    // const { rows }  = await db
    //     .insert({
    //         username: 'michael',
    //     })
    //     .table('users')
    //     .returning(['id', 'username']);
    //
    //  console.log('insert user=>', rows[0].id, rows[0].username);
});
