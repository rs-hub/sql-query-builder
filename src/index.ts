import * as pg from 'pg';
import Insert from './Insert';
import Select from './Select';
import CreateTable from './CreateTable';
import Update from './Update';

export const pool = new pg.Pool();

interface dataBase {
    insert(value: object): Insert;

    select(conditions: object): Select;

    createTable(value: object): CreateTable;

    update(conditions: object): Update;
}

export default class DataBase implements dataBase {
    insert(value): Insert {
        return new Insert(value);
    }

    select(conditions): Select {
        return new Select(conditions);
    }

    createTable(value): CreateTable {
        return new CreateTable(value);
    }

    update(conditions): Update {
        return new Update(conditions);
    }
}
