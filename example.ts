import DataBase from "./src";

const db = new DataBase();

const { sql } = db.createTable(
    {
        id: {
            type: "id",
        },
        userId: {
            type: "int",
            constraints: ["notNull"],
            references: {
                table: 'users',
                field: 'id',
                method: 'onDeleteCascade',
            }
        },
    })
    .table("posts")
    .ifNotExist()
    .generate();

console.log(sql);
