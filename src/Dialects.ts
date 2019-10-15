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
