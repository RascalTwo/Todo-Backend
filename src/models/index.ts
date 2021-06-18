import { Sequelize } from 'sequelize';

import { SEQUELIZE_OPTIONS } from '../constants';

import initTodo from './Todo';

const sequelize = new Sequelize(SEQUELIZE_OPTIONS);
initTodo(sequelize);

export default async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};
