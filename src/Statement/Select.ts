import Dialects from "../Dialects";

interface ISelect {
    skip(name: number): Select;

    limit(count: number): Select;

    column(columns: string[]): Select;

    orderBy(order: string): Select;

    table(table: string): Select;

    generate(): { sql: string; values: any[] };

    innerJoin(tableAndConditions: { tables: string[]; conditions: string[] }): any;

    query(): Promise<any>;
}

export default class Select extends Dialects implements ISelect {
    private offset: number | undefined;
    private limitCount: number | undefined;
    private columns: string[] | string;
    private order: string | undefined;
    private readonly conditions: {} | undefined;
    private readonly values: any[] | undefined;
    private byTable: string | undefined;
    private join: string | undefined;

    constructor(data) {
        super();
        const { values, conditions } = this.buildWhere(data);
        this.values = values;
        this.conditions = conditions;
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
        return this;
    }

    public innerJoin(data: { tables: string[]; conditions: string[] }) {
        this.join = this.buildJoinCondition(data);
        return this;
    }

    public generate() {
        let sql = `SELECT ${this.columns || "*"} FROM ${this.byTable}`;
        if (this.join) {
            sql += ` ${this.join}`;
        }
        if (this.conditions) {
            sql += ` WHERE ${this.conditions}`;
        }
        if (this.limitCount) {
            sql += ` LIMIT ${this.limitCount}`;
        }
        if (this.offset) {
            sql += ` OFFSET ${this.offset}`;
        }
        if (this.order) {
            sql += ` ORDER BY ${this.order}`;
        }

        return {
            sql,
            values: this.values,
        };
    }

    public query() {
        const { sql, values } = this.generate();
        return this.pool.query(sql, values);
    }
}
