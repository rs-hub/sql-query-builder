export default class Dialects {
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

    public buildColumns(data: object) {
        let columnsTypes = Object.values(data).map(el => {
            const type = this.dataType[`${el}`];
            if(!type)  throw {
                message: 'Invalid type column',
                error: el
            };

            return type;
        });
        let columnsName = Object.keys(data);
        return columnsName.map((el, i) => `${el} ${columnsTypes[i]}`).join(', ')
    }
}
