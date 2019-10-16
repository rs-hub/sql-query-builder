import * as pg from 'pg';
import Insert from './Insert';
import Select from './Select';
import CreateTable from './CreateTable';

export const pool = new pg.Pool();

interface dataBase {
    insert(value: object): Insert;

    select(value: object): Select;

    createTable(value: object): CreateTable;
}

export default class DataBase implements dataBase {
    insert(value): Insert {
        return new Insert(value);
    }

    select(value): Select {
        return new Select(value);
    }

    createTable(value): CreateTable {
        return new CreateTable(value);
    }
}
