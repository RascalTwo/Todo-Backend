import { Sequelize } from 'sequelize';

import { NODE_ENV, SEQUELIZE_OPTIONS, DATABASE_URL } from '../constants';

import initTodo from './Todo';

const options = {
  ...SEQUELIZE_OPTIONS,
  logging:
    NODE_ENV !== 'production' // @ts-ignore
      ? (sql, timing) => console.log(sql + (timing && timing.bind ? ' ' + timing.bind.toString() : ''))
      : false,
}
const sequelize = DATABASE_URL ? new Sequelize(DATABASE_URL, options) : new Sequelize(options);
initTodo(sequelize);

/**
 * Connect to and sync the database.
 *
 * @see {@link Sequelize.authenticate}
 * @see {@link Sequelize.sync}
 */
export default async () => {
  await sequelize.authenticate();
  await sequelize.sync();
};
