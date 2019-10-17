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

     console.log(user); // [ { id: 8, username: 'rs-hub' } ]
     */

    /**
     const { rows } = await db
     .insert({
            username: 'michael',
        })
     .table('users')
     .returning(['id', 'username'])
     .query();

     console.log(rows); // [ { id: 12, username: 'michael' } ]
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


    /**
     const update = await db
     .update({
            id: 6,
            username: 'rs-hub'
        })
     .table('users')
     .set({
            username: 'rs-hub',
        })
     .query();
     console.log(update);
     */

    /**
     const { rows: posts } = await db
     .select({
            username: 'rs-hub'
        })
     .table("users")
     .column(["users.id as userId", "posts.id as postId", "posts.text as postsText"])
     .innerJoin({
            table: 'posts',
            condition: 'users.id = posts.userid'
        })
     .limit(1)
     .skip(1)
     .query();
     console.log(posts);
     */

    /**
     const { rows } = await db
     .select({
            username: 'rs-hub'
        })
     .table("users")
     .column(["users.id as userId", "posts.id as postId", "posts.text as postsText", "comments.comment"])
     .innerJoin({
            tables: ['posts', 'comments'],
            conditions: ['users.id = posts.userid', 'comments.postsid = posts.id']
        })
     .limit(1)
     .skip(1)
     .query();
     console.log(rows) // [ { userid: 8, postid: 1, poststext: 'hello', comment: 'Good' } ];
     */
});
