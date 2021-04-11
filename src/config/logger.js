import winston from 'winston';
import moment from 'moment';

winston.emitErrs = true;

const logger = (env) => {
  let ret;

  switch (env) {
    case 'production':
    case 'development':
    case 'staging':
    case 'test':
      ret = new winston.Logger({
        transports: [
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
          }),
          new winston.transports.File({
            level: 'info',
            filename: './test.log',
            handleExceptions: true,
            json: false,
            maxsize: 5242880,
            maxFiles: 50,
            colorize: false
          })
        ],
        exitOnError: false
      });
      break;
    default:
      ret = new winston.Logger({
        transports: [
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
          }),
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
          })
        ],
        exitOnError: false
      });
      break;
  }

  ret.stream = {
    write: (message, encoding) => {
      logger.info(message);
    }
  };

  return ret;
};

export default logger;
