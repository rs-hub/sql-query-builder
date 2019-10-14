export default class DataBase {
    private offset: number | undefined;
    private limitCount: number | undefined;
    private columns: string[] | undefined;
    private order: string | undefined;
    private conditions: {} | undefined;
    private args: any[] | undefined;
    private byTable: string | undefined;

    public skip(name: number) {
        this.offset = name;
        return this;
    }

    public limit(count: number) {
        this.limitCount = count;
        return this;
    }

    public fields(columns: string[]) {
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

    public where(conditions: {}) {
        this.args = [];
        this.conditions = Object.entries(conditions).reduce((prev, [value, key], i) => {
            this.args.push(value);
            return prev ? `${prev} AND ${`${value} = $${i + 1}`}` : `${value} = $${i + 1}`;
        }, "");
        return this;
    }

    public then(callback: (res) => void) {
        let sql = `SELECT ${this.columns} FROM ${this.byTable}`;
        if (this.conditions) { sql += ` WHERE ${this.conditions}`; }
        if (this.limitCount) { sql += ` LIMIT ${this.limitCount}`; }
        if (this.order) { sql += ` ORDER BY ${this.order}`; }
        callback(sql);
    }
}