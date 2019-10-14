import { pool } from '../index';

const sqlCreateTable = `
    CREATE TABLE if not exists users
    (
        id       serial PRIMARY KEY,
        username varchar(255)
    );
    CREATE TABLE if not exists posts
    (
        id     serial PRIMARY KEY,
        userId integer NOT NULL REFERENCES users (id) ON DELETE CASCADE,
        text   text
    );
`;
const sqlInsertUSer = `INSERT INTO users (username)
                       SELECT 'rs-hub'
                       WHERE NOT EXISTS(
                               SELECT username FROM users WHERE username = 'rs-hub'
                           );`;
export default async () => {
    await pool.query(sqlCreateTable);
    await pool.query(sqlInsertUSer);
};
