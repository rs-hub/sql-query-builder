import Dialects from "./Dialects";
import { pool } from "./index";

interface createTable {
    table(value: string): CreateTable;
    ifNotExist(): CreateTable;
    generate(): {
        sql: string
    };
    query(): Promise<any>
}

export default class CreateTable extends Dialects implements createTable{
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

    public generate() {
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

        return { sql };
    }

    public query() {
        const { sql } = this.generate();
        return pool.query(sql);
    }

}
