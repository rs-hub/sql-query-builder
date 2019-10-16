import DataBase from './';
import seed from './seed/tablesUsersAndPosts';

const db = new DataBase();

seed().then(async () => {
    /**
    const { rows: user } = await db
        .select({
            username: 'rs-hub'
        })
        .table("users")
        .column(["id", "username"])
        .limit(1)
        .skip(1)
        .query();

    console.log('select user =>', user[0].id, user[0].username);
    */

    /**
     const { rows } = await db
     .insert({
            username: 'michael',
        })
     .table('users')
     .returning(['id', 'username'])
     .query();

     console.log('insert user=>', rows[0].id, rows[0].username);
     */

    /**
     const newTable = await db.createTable({
        id: {
            type: 'id',
        },
        comment: {
            type: 'text',
            constraints: ['notNull', 'unique']
        },
        userId: {
            type: 'int',
            constraints: ['notNull']
        }
    })
     .table('comments').ifNotExist()
     .query();

     console.log(newTable);
     */

});
