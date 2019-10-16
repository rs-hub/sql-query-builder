import Dialects from "./Dialects";
import { pool } from "./index";

export default class CreateTable extends Dialects {
    private tableName: string | undefined;
    private readonly columns :string;
    private isIfNotExist: boolean | undefined;

    constructor(data) {
        super();
        if (data) {
            this.columns = this.buildColumns(data);
        }
    }

    public table(tableName: string) {
        this.tableName = tableName;
        return this
    }

    public ifNotExist() {
        this.isIfNotExist = true;
        return this
    }
    public async then(callback: (res) => void) {
        let sql = 'CREATE TABLE';
        if(this.isIfNotExist){
            sql += ` ${this.constraints['ifNotExist']}`;
        }
        if(this.tableName) {
            sql += ` ${this.tableName}`
        }
        if(this.columns) {
            sql += ` (${this.columns})`
        }

        const result = await pool.query(sql);
        callback(result);
    }
}
