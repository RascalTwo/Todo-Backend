import path from 'path';

import dotenv from 'dotenv';
import { Options } from 'sequelize/types';
dotenv.config();

export const PORT = process.env['PORT'] || 5000;
export const STATIC_DIRECTORY = path.join(__dirname, process.env['STATIC_DIRECTORY'] || './static');
export const SEQUELIZE_OPTIONS = JSON.parse(
  process.env['DB_CONNECTION_URI'] || JSON.stringify({ dialect: 'sqlite', storage: './database.db' }),
) as Options;
export const CORS_ORIGIN = process.env['CORS_ORIGIN'] || false;
