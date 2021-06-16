import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

export interface TodoAttributes {
  list_code: string;
  text: string;
  completed: Date | null;
  created: Date;
  updated: Date;
}

export class Todo
  extends Model<TodoAttributes, Optional<TodoAttributes, 'completed' | 'created' | 'updated'>>
  implements TodoAttributes
{
  public list_code!: string;
  public text!: string;
  public completed!: Date | null;

  public readonly created!: Date;
  public readonly updated!: Date;

  toJSON() {
    const { list_code, text, completed, created, updated } = this.get();
    return {
      list_code,
      text,
      completed: completed?.getTime() || null,
      created: created.getTime(),
      updated: updated.getTime(),
    };
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
        type: DataTypes.DATE,
      },
      created: {
        type: DataTypes.DATE,
      },
      updated: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'todo',
      createdAt: 'created',
      updatedAt: 'updated',
    },
  );
  Todo.removeAttribute('id');
};
