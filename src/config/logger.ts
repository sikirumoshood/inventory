import winston from 'winston';
import config from '../config';
import moment from 'moment';

const createConsoleTransport = (level: string, handleExceptions: boolean, json: boolean, colorize: boolean ) => {
  const opts = {
    level,
    handleExceptions,
    json,
    colorize,
    timestamp: () => `[ ${moment().format('DD-MMM-YYYY, h:mm:ss a')}} ]:`
  };

  return new winston.transports.Console(opts);
}

const createFileTransport = (level: string, filename: string, handleExceptions: boolean, json: boolean, colorize: boolean, maxsize: number, maxFiles:number ) => {
  const opts = {
    level,
    filename,
    handleExceptions,
    json,
    maxsize,
    maxFiles,
    colorize
  };

  return new winston.transports.File(opts);
}

const loggerInit = (env: string) => {
  let ret;

  switch (env) {
    case 'development':
    case 'staging':
    case 'test':
      ret = new winston.Logger({
        transports: [
          createConsoleTransport('debug', true, false, true),
          createFileTransport('info', 'server.log', true, false, true, 5242880, 50)
        ],
        exitOnError: false
      });
      break;

    case 'production':
      ret = new winston.Logger({
        transports: [
          createConsoleTransport('debug', true, false, true),
          createFileTransport('info', 'server.log', true, false, true, 5242880, 50)
        ],
        exitOnError: false
      });
  }

  return ret;
};

const defaultLogger = {
   info: (msg?:any) => {},
   debug: (msg?:any) => {},
   error: (msg?:any) => {}
}

// @ts-ignore
const logger = loggerInit(config.ENVIRONMENT) || defaultLogger;
export default logger;
