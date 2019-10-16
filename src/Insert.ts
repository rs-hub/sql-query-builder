import { pool } from "./index";

export default
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

    public returning(columns: string[]) {
        this.columns = columns;
        return this
    }

    public async then(callback: (res) => void) {
        const values = this.value.map((el, i) => `$${i + 1}`).join(', ');
        let sql = `insert into ${this.byTable} (${this.key}) values (${values})`;
        if (this.columns) {
            sql += ` RETURNING ${this.columns.join(', ')}`;
        }

        const result = await pool.query(sql, this.value);
        callback(result);
    }
}
