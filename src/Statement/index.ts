import CreateTable from "./CreateTable";
import Insert from "./Insert";
import Select from "./Select";
import Update from "./Update";

interface IStatement {
    insert(value: object): Insert;

    select(conditions: { }): Select;

    createTable(columns: object): CreateTable;

    update(conditions: object): Update;
}

export default class Statement implements IStatement {
    public insert(value): Insert {
        return new Insert(value);
    }

    public select(conditions): Select {
        return new Select(conditions);
    }

    public createTable(columns): CreateTable {
        return new CreateTable(columns);
    }

    public update(conditions): Update {
        return new Update(conditions);
    }
}
