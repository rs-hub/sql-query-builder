import Dialects from "../Dialects";

interface IInsert {
    table(table: string): Insert;
    returning(columns: string[]): Insert;
    generate(): {
        sql: string
        values: any[],
    };
    query(): Promise<any>;
}

export default class Insert extends Dialects implements IInsert {
    private byTable: string | undefined;
    private readonly key: {} | undefined;
    private readonly values: any[] | undefined;
    private columns: string[] | undefined;

    constructor(data) {
        super();
        if (data) {
            this.values = Object.values(data);
            this.key = Object.keys(data);
        }
    }

    public table(table: string) {
        this.byTable = table;
        return this;
    }

    public returning(columns: string[]) {
        this.columns = columns;
        return this;
    }

    public query() {
        const { sql, values } = this.generate();
        return this.pool.query(sql, values);
    }

    public generate() {
        const values = this.values.map((el, i) => `$${i + 1}`).join(", ");
        let sql = `insert into ${this.byTable} (${this.key}) values (${values})`;
        if (this.columns) {
            sql += ` RETURNING ${this.columns.join(", ")}`;
        }

        return {
            sql,
            values: this.values,
        };
    }
}
