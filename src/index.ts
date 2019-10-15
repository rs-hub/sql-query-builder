import * as pg from 'pg';

export const pool = new pg.Pool();

class Insert {
    private byTable: string | undefined;
    private readonly key: {} | undefined;
    private readonly value: any[] | undefined;
    private columns: string[] | undefined;

    constructor(data) {
        if (data) {
            this.value = Object.values(data);
            this.key = Object.keys(data);
        }
    }

    public table(table: string) {
        this.byTable = table;
        return this
    }

    public returning(columns: string[]){
        this.columns = columns;
        return this
    }
    public async then(callback: (res) => void) {
        const values =  this.value.map((el, i) => `$${i + 1}`).join(', ');
        let sql = `insert into ${this.byTable} (${this.key}) values (${values})`;
        if (this.columns) {
            sql += ` RETURNING ${this.columns.join(', ')}`;
        }

        const result  = await pool.query(sql, this.value);
        callback(result);
    }
}

class Select {
    private offset: number | undefined;
    private limitCount: number | undefined;
    private columns: string[] | undefined;
    private order: string | undefined;
    private readonly conditions: {} | undefined;
    private readonly value: any[] | undefined;
    private byTable: string | undefined;

    constructor(conditions) {
        if (conditions) {
            this.value = [];
            this.conditions = Object.entries(conditions).reduce((prev, [value, key], i) => {
                this.value.push(key);
                return prev ? `${prev} AND ${`${value} = $${i + 1}`}` : `${value} = $${i + 1}`;
            }, "");
        }
    }
    public skip(name: number) {
        this.offset = name;
        return this;
    }

    public limit(count: number) {
        this.limitCount = count;
        return this;
    }

    public column(columns: string[]) {
        this.columns = columns;
        return this;
    }

    public orderBy(order: string) {
        this.order = order;
        return this;
    }

    public table(table: string) {
        this.byTable = table;
        return this
    }

    public async then(callback: (res) => void) {
        let sql = `SELECT ${this.columns} FROM ${this.byTable}`;
        if (this.conditions) {
            sql += ` WHERE ${this.conditions}`;
        }
        if (this.limitCount) {
            sql += ` LIMIT ${this.limitCount}`;
        }
        if (this.order) {
            sql += ` ORDER BY ${this.order}`;
        }

        const { rows } = await pool.query(sql, this.value);
        callback(rows);
    }
}

interface dataBase {
    insert(value: object): Insert;
    select(value: object): Select;
}

export default class DataBase implements dataBase {
    insert(value): Insert {
        return new Insert(value);
    }

    select(value): Select {
        return new Select(value);
    }
}
