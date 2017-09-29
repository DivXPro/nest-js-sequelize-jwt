import * as log4js from 'log4js';
import * as config from 'config';

interface LogConfig {
  LEVEL: string;
}
const logConfig = config.get('LOG') as LogConfig;
export const logger = log4js.getLogger();
logger.level = logConfig.LEVEL;