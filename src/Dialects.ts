import DataBase from "./index";
import * as pg from "pg";

interface dialects {
    buildConstraints(constraints: string[]): String;
    buildColumns(data: object): String;
    buildWhere(conditions: object): {
        conditions: string,
        values: any[]
    };
}

export default class Dialects implements dialects {
    public pool: pg.Pool;
    constructor() {
        this.pool = DataBase.getPool();
    }

    public dataType = {
        id: 'serial PRIMARY KEY',
        int: 'int',
        float: 'float',
        bool: 'bool',
        text: 'text',
        date: 'date',
        varchar: 'varchar(255)',
    };

    public constraints = {
        unique: 'unique',
        notNull: 'NOT NULL',
        ifNotExist: 'if not exists'
    };

    public buildConstraints(constraints: string[]) {
        return constraints ? constraints.map(el => {
            const constraint = this.constraints[el];
            if (!constraint)  throw {
                message: 'Invalid constraint',
                error: el
            };
            return constraint
        }).join(' ') : '';
    }

    public buildWhere(data: object) {
            let values = [];
            const conditions = Object.entries(data).reduce((prev, [value, key], i) => {
                values.push(key);
                return prev ? `${prev} AND ${`${value} = $${i + 1}`}` : `${value} = $${i + 1}`;
            }, "");
            return {
                conditions,
                values
            }
    }

    public buildColumns(data: object) {
        let columnsTypes = Object.values(data).map(el => {
            const type = this.dataType[`${el.type}`];
            const constraints = this.buildConstraints(el.constraints);

            if(!type)  throw {
                message: 'Invalid type column',
                error: el
            };

            return { type,  constraints };
        });
        let columnsName = Object.keys(data);
        return columnsName.map((el, i) => {
            const types = columnsTypes[i].type;
            const constraints = columnsTypes[i].constraints;
            return `${el} ${types} ${constraints}`
        }).join(', ')
    }
}
