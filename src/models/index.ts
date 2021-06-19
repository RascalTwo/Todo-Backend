import { Sequelize } from 'sequelize';

import { NODE_ENV, SEQUELIZE_OPTIONS } from '../constants';

import initTodo from './Todo';

const sequelize = new Sequelize({
  ...SEQUELIZE_OPTIONS,
  logging:
    NODE_ENV !== 'production' // @ts-ignore
      ? (sql, timing) => console.log(sql + (timing && timing.bind ? ' ' + timing.bind.toString() : ''))
      : false,
});
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
