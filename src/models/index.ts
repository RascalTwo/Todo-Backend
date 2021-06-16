import { Sequelize } from 'sequelize';

import { SEQUELIZE_OPTIONS } from '../constants.js';

import initTodo from './Todo.js';

const sequelize = new Sequelize(SEQUELIZE_OPTIONS);
initTodo(sequelize);

export default async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};
