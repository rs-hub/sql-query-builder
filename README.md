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
     const rows = await db
          .insert({
              username: 'michael',
           })
          .table('users');

     console.log('insert user =>', rows.id, rows.username);
```
