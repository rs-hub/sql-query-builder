import * as pg from "pg";
import Statement from "./Statement";

export default class DataBase extends Statement {
    public static pool: pg.Pool;

    public static getPool(config?: pg.PoolConfig): pg.Pool {
        if (!DataBase.pool) {
            DataBase.pool = new pg.Pool(config);
        }
        return DataBase.pool;
    }

    constructor(config?: pg.PoolConfig) {
        super();
        DataBase.getPool(config);
    }}
