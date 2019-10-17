# sql-query-builder
Sql query builder for educational purposes

**Select:**
```js
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
```

**Insert:**
```js
     const { rows } = await db
         .insert({
                username: 'michael',
            })
         .table('users')
         .returning(['id', 'username'])
         .query();

     console.log(rows); // [ { id: 12, username: 'michael' } ]
```

**Create Table:**
```js
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
      .table('comments')
      .ifNotExist()
      .query();
    console.log('createTable');
```

**Update:**
```js
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
```

**Join:**
```js
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
```
