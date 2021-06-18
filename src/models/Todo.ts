import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TodoAttributes {
  list_code: string;
  text: string;
  completed: number | null;
  created: number;
  updated: number | null;
}

export class Todo
  extends Model<TodoAttributes, Optional<TodoAttributes, 'completed' | 'updated'>>
  implements TodoAttributes
{
  public list_code!: string;
  public text!: string;
  public completed!: number | null;
  public created!: number;
  public updated!: number | null;

  toJSON(){
    const { completed, updated, ...rest } = this.get();

    return {
      ...rest,
      completed: completed ? completed : null,
      updated: updated ? updated : null,
    }
  }
}

export default (sequelize: Sequelize) => {
  Todo.init(
    {
      list_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BIGINT,
      },
      created: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      updated: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      tableName: 'todo',
      timestamps: false
    },
  );
  Todo.removeAttribute('id');
};
