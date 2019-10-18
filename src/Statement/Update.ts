import Dialects from "../Dialects";

interface IUpdate {
    table(table: string): Update;
    set(update: object): Update;
    generate(): {
        sql: string
        values: any[],
    };
    query(): Promise<any>;
}

export default class Update extends Dialects implements IUpdate {
    private readonly conditions: {} | undefined;
    private readonly values: any[] | undefined;
    private byTable: string | undefined;
    private setColumns: string | undefined;

    constructor(data) {
        super();
        const { values, conditions} = this.buildWhere(data);
        this.values = values;
        this.conditions = conditions;
    }

    public set(update: object): Update {
        this.setColumns = Object.entries(update).map(([value, key]) => {
            this.values.push(key);
            return `${value} = $${this.values.length}`;
        }).join(", ");
        return this;
    }

    public table(table: string) {
        this.byTable = table;
        return this;
    }

    public generate() {
        let sql = `UPDATE ${this.byTable}`;
        if (this.setColumns) {
            sql += ` SET ${this.setColumns}`;
        }
        if (this.conditions) {
            sql += ` WHERE ${this.conditions}`;
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
