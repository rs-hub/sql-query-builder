import { pool } from "./index";

interface select {
    skip(name: number): Select;
    limit(count: number): Select;
    column(columns: string[]): Select;
    orderBy(order: string): Select;
    table(table: string):Select;
    generate(): {
        sql: string
        value: any[]
    };
    query(): Promise<any>
}


export default class Select implements select{
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

    public generate() {
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

        return {
            sql,
            value: this.value
        };
    }

    public query() {
        const { sql, value } = this.generate();
        return pool.query(sql, value);
    }
}
