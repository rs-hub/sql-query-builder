# sql-query-builder
Sql query builder for educational purposes

**Select:**
```js
   const user = await db
        .select({
            username: 'rs-hub'
        })
        .table("users")
        .column(["id", "username"])
        .limit(1)
        .skip(1);

    console.log('select user =>', user[0].id, user[0].username);
```


**Insert:**
```js
    const { rows }  = await db
        .insert({
            username: 'michael',
        })
        .table('users')
        .returning(['id', 'username']);

     console.log('insert user=>', rows[0].id, rows[0].username);
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
    }).table('comments')
      .ifNotExist();

    console.log('createTable');
```
