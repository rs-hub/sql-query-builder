import * as pg from "pg";
import DataBase from "./index";

interface IDialects {
    buildConstraints(constraints: string[]): string;

    buildColumns(data: object): string;

    buildWhere(conditions: object): {
        conditions: string,
        values: any[],
    };
}

export default class Pg implements IDialects {
    public pool: pg.Pool;

    public dataType = {
        id: "serial PRIMARY KEY",
        int: "int",
        float: "float",
        bool: "bool",
        text: "text",
        date: "date",
        varchar: "varchar(255)",
    };

    public constraints = {
        unique: "unique",
        notNull: "NOT NULL",
        ifNotExist: "if not exists",
    };
    public references = {
        onDeleteCascade: "on delete cascade",
        onDeleteRestrict: "on delete restrict",
        onUpdateCascade: "on update cascade",
        onUpdateRestrict: " on update restrict",
    };

    constructor() {
        this.pool = DataBase.getPool();
    }

    public buildConstraints(constraints: string[]) {
        return constraints ? constraints.map((el) => {
            const constraint = this.constraints[el];
            if (!constraint) {
                throw {
                    message: "Invalid constraint",
                    error: el,
                };
            }
            return constraint;
        }).join(" ") : "";
    }

    public buildReferences({ table, field, method }: { table: string, field: string, method?: string }) {
        method = this.references[method];
        if (!method) {
            throw {
                message: "Invalid method",
                error: method,
            };
        }
        return `references ${table} (${field}) ${method}`;
    }

    public buildWhere(data: object) {
        const values = [];
        const conditions = Object.entries(data).reduce((prev, [value, key], i) => {
            values.push(key);
            return prev ? `${prev} AND ${`${value} = $${i + 1}`}` : `${value} = $${i + 1}`;
        }, "");
        return {
            conditions,
            values,
        };
    }

    public buildJoinCondition({ tables, conditions }: { tables: string[], conditions: string[] }) {
        return tables.map((el, i) => {
            return `INNER JOIN ${el} ON (${conditions[i]})`;
        }).join(" ");
    }

    public buildColumns(data: object) {
        const columnsTypes = Object.values(data).map((el) => {
            const type = this.dataType[`${el.type}`];
            const constraints = this.buildConstraints(el.constraints);
            const references = el.references ? this.buildReferences(el.references) : null;
            if (!type) {
                throw {
                    message: "Invalid type column",
                    error: el,
                };
            }

            return { type, constraints, references };
        });

        const columnsName = Object.keys(data);
        return columnsName.map((el, i) => {
            const types = columnsTypes[i].type;
            const constraints = columnsTypes[i].constraints;
            const references = columnsTypes[i].references;

            let columns = `${el} ${types} ${constraints}`;
            if (references) { columns += ` ${references}`; }
            return columns;
        }).join(", ");
    }
}
