import Dialects from "../Dialects";

interface select {
    skip(name: number): Select;
    limit(count: number): Select;
    column(columns: string[]): Select;
    orderBy(order: string): Select;
    table(table: string):Select;
    generate(): { sql: string; value: any[] };
    innerJoin(tableAndConditions: { table: string; condition: string }): any
    query(): Promise<any>
}


export default class Select extends Dialects implements select {
    private offset: number | undefined;
    private limitCount: number | undefined;
    private columns: string[] | undefined;
    private order: string | undefined;
    private readonly conditions: {} | undefined;
    private readonly values: any[] | undefined;
    private byTable: string | undefined;
    private joinTable: string | undefined;
    private joinCondition: string | undefined;

    constructor(data) {
        super();
        const { values, conditions} = this.buildWhere(data);
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
        return this
    }

    public innerJoin({ table, condition }: { table: string; condition: string }) {
        this.joinTable = table;
        this.joinCondition = condition;
        return this
    }
    public generate() {
        let sql = `SELECT ${this.columns} FROM ${this.byTable}`;
        if (this.joinTable) {
            sql += ` INNER JOIN ${this.joinTable} ON ${this.joinCondition}`;
        }
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
            value: this.values
        };
    }

    public query() {
        const { sql, value } = this.generate();
        return this.pool.query(sql, value);
    }
}
