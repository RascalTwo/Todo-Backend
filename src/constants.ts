import path from 'path';

import dotenv from 'dotenv';
import { Options } from 'sequelize/types';
dotenv.config();

export const NODE_ENV = process.env['NODE_ENV'] || 'production' as 'production' | 'development' | 'testing';

export const PORT = process.env['PORT'] || 5000;

/** Directory of [static assets](https://expressjs.com/en/starter/static-files.html#serving-static-files-in-express) */
export const STATIC_DIRECTORY = (() => {
  const passed = process.env['STATIC_DIRECTORY'];
  if (!passed) return undefined;
  return path.isAbsolute(passed) ? passed : path.join(__dirname, passed);
})();

/** {@link Options Sequelize Options} */
export const SEQUELIZE_OPTIONS = JSON.parse(
  process.env['SEQUELIZE_OPTIONS'] || JSON.stringify({ dialect: 'sqlite', storage: './database.db' }),
) as Options;

export const DATABASE_URL = process.env['DATABASE_URL'] || null;

export const CORS_ORIGIN = process.env['CORS_ORIGIN'] || false;

export const SESSION_SECRET = process.env['SESSION_SECRET'] || 'cat keyboard';

export const CSRF_SECRET = process.env['CSRF_SECRET'] || 'csrf secret';
