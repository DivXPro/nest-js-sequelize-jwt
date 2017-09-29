'use strict';

export interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
  logging: boolean | Function;
  force: boolean;
  timezone: string;
  modelPaths: Array<string>;
}

export interface DBConfig {
  DB_USER: string;
  DB_DIALECT: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_LOG: boolean;
  JWT_ID: string;
  JWT_KEY: string;
}
