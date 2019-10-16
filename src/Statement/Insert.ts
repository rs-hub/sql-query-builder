import Dialects from "../Dialects";

interface insert {
    table(table: string): Insert;
    returning(columns: string[]): Insert;
    generate(): {
        sql: string
        value: any[]
    };
    query(): Promise<any>
}

export default class Insert extends Dialects implements insert{
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
        return this
    }

    public returning(columns: string[]) {
        this.columns = columns;
        return this
    }

    public query() {
        const { sql, value } = this.generate();
        return this.pool.query(sql, value);
    }

    public generate() {
        const values = this.values.map((el, i) => `$${i + 1}`).join(', ');
        let sql = `insert into ${this.byTable} (${this.key}) values (${values})`;
        if (this.columns) {
            sql += ` RETURNING ${this.columns.join(', ')}`;
        }

        return {
            sql,
            value: this.values
        };
    }
}
