import Insert from "./Insert";
import Select from "./Select";
import CreateTable from "./CreateTable";
import Update from "./Update";

interface index {
    insert(value: object): Insert;

    select(conditions: object): Select;

    createTable(value: object): CreateTable;

    update(conditions: object): Update;
}

export default class Statement implements index {
    public insert(value): Insert {
        return new Insert(value);
    }

    public select(conditions): Select {
        return new Select(conditions);
    }

    public createTable(value): CreateTable {
        return new CreateTable(value);
    }

    public update(conditions): Update {
        return new Update(conditions);
    }
}
