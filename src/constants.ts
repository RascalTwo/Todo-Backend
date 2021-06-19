import path from 'path';

import dotenv from 'dotenv';
import { Options } from 'sequelize/types';
dotenv.config();

export const NODE_ENV = process.env['NODE_ENV'] as 'production' | 'development' | 'testing';

export const PORT = process.env['PORT'] || 5000;

/** Directory of [static assets](https://expressjs.com/en/starter/static-files.html#serving-static-files-in-express) */
export const STATIC_DIRECTORY = path.join(__dirname, process.env['STATIC_DIRECTORY'] || './static');

/** {@link Options Sequelize Options} */
export const SEQUELIZE_OPTIONS = JSON.parse(
  process.env['SEQUELIZE_OPTIONS'] || JSON.stringify({ dialect: 'sqlite', storage: './database.db' }),
) as Options;

export const CORS_ORIGIN = process.env['CORS_ORIGIN'] || false;
