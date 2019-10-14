import  DataBase from './';

const db = new DataBase();
db
    .table("users")
    .fields(["id", "name"])
    .limit(1)
    .skip(1)
    .orderBy("desc")
    .then((res) => {
        console.log(res)
});
