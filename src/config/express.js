import fs from 'fs';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import FileStreamRotator from 'file-stream-rotator';
import loggerInit from './logger';

const logDirectory = './log';
const checkLogDir = fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const expressConfig = (app) => {
  let accessLogStream;
  let logger;

  if (app.get('env') === 'development') {
    logger = loggerInit('development');
  } else if (app.get('env') === 'production') {
    logger = loggerInit('production');
  } else if (app.get('env') === 'test') {
    logger = loggerInit('test');
  } else {
    logger = loggerInit();
  }

  global.logger = logger;
  logger.info('Application starting...');
  logger.debug("Overriding 'Express' logger");

  if (checkLogDir) {
    accessLogStream = FileStreamRotator.getStream({
      date_format: 'YYYYMMDD',
      filename: `${logDirectory}/application-%DATE%.log`,
      frequency: 'weekly',
      verbose: false
    });
  }

  app.use(morgan('combined', { stream: accessLogStream }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(helmet());
  app.disable('x-powered-by');

// ----------------------- SERVER HEADERS ----------------------
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Origin, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });
// ----------------------- SERVER HEADERS ----------------------


// ---------------------- ROUTES --------------------------
   // app.use('/api/v1/admin', adminRoutes);
// ------------------------ END OF ROUTES -------------------
  app.use((req, res) => res.status(404).json({
    message: 'Not Found',
    status: 404
  }));
};

export default expressConfig;
