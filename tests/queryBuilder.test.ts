import { expect } from "chai";
import DataBase from "../src/index";

describe("Generate select query", async () => {
    const db = new DataBase();
    it("methods table and column", async () => {
        const value = [8, "rs-hub"];
        const { sql, values } = db
            .select({
                id: value[0],
                username: value[1],
            })
            .table("users")
            .column(["id", "username"])
            .generate();

        expect(sql).to.eql("SELECT id,username FROM users WHERE id = $1 AND username = $2");
        expect(values).to.eql(value);
    });

    it("methods limit and orderBy", async () => {
        const value = [8, "rs-hub"];
        const { sql } = db
            .select({
                id: value[0],
                username: value[1],
            })
            .table("users")
            .column(["id"])
            .limit(1)
            .orderBy("desc")
            .generate();

        expect(sql).to.eql("SELECT id FROM users WHERE id = $1 AND username = $2 LIMIT 1 ORDER BY desc");
    });

    it("methods innerJoin and skip", async () => {
        const value = [8];
        const { sql, values } = db
            .select({
                "users.id": value[0],
            })
            .table("users")
            .column(["users.id as userId", "posts.id as postId", "posts.text as postsText"])
            .innerJoin({
                tables: ["posts"],
                conditions: ["users.id = posts.userid"],
            })
            .skip(1)
            .generate();

        expect(sql).to.eql("SELECT users.id as userId,posts.id as postId,posts.text as postsText FROM users INNER JOIN posts ON (users.id = posts.userid) WHERE users.id = $1 OFFSET 1");
        expect(values).to.eql(value);
    });

});

describe("Generate insert query", async () => {
    const db = new DataBase();
    it("methods insert returning table", async () => {
        const value = ["rs-hub"];
        const { sql, values } = db
            .insert({
                username: value[0],
            })
            .table("users")
            .returning(["id", "username"])
            .generate();

        expect(sql).to.eql("insert into users (username) values ($1) RETURNING id, username");
        expect(values).to.eql(value);
    });
});

describe("Generate update query", async () => {
    const db = new DataBase();
    it("methods update table set", async () => {
        const value = [6, "rs-hub", "rs-hub"];
        const { sql, values } = db
            .update({
                id: value[0],
                username: value[1],
            })
            .table("users")
            .set({
                username: value[2],
            })
            .generate();

        expect(sql).to.eql("UPDATE users SET username = $3 WHERE id = $1 AND username = $2");
        expect(values).to.eql(value);
    });
});

describe("Generate create table query", async () => {
    const db = new DataBase();
    it("methods table and ifNotExist / generate columns", async () => {
        const { sql } = db.createTable(
            {
                id: {
                    type: "id",
                },
                comment: {
                    type: "text",
                    constraints: ["notNull", "unique"],
                },
                userId: {
                    type: "int",
                    constraints: ["notNull"],
                },
            })
            .table("comments")
            .ifNotExist()
            .generate();

        expect(sql).to.eql("CREATE TABLE if not exists comments (id serial PRIMARY KEY , comment text NOT NULL unique, userId int NOT NULL)");
    });
    it("methods references", async () => {
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

        expect(sql).to.eql("CREATE TABLE if not exists posts (id serial PRIMARY KEY , userId int NOT NULL references users (id) on delete cascade)");
    });
});
