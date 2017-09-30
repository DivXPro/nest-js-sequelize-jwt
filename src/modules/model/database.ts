import * as config from 'config';
import * as path from 'path';
import { DatabaseConfig, DBConfig } from '../interface';
import * as SequelizeStatic from 'sequelize';

const DB = config.get('DB') as DBConfig;

export const databaseConfig: DatabaseConfig = {
    username: DB.DB_USER || '',
    password: DB.DB_PASSWORD || '',
    database: DB.DB_NAME || '',
    host: DB.DB_HOST || '127.0.0.1',
    port: Number(DB.DB_PORT) || 5432,
    dialect: DB.DB_DIALECT || 'mysql',
    logging: DB.DB_LOG || false,
    force: true,
    timezone: '+08:00',
    modelPaths: [path.resolve(__dirname, '../models')]
};

export const sequelize = new SequelizeStatic(databaseConfig);
