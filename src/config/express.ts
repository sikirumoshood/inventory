import morgan from 'morgan';
import bodyParser from 'body-parser';
import logger from './logger';

const helmet = require('helmet');

const expressConfig = (app: any) => {
  let accessLogStream;

  logger.info('Application starting...');
  logger.debug("Overriding 'Express' logger");

  app.use(morgan('combined', { stream: accessLogStream }));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(helmet());
  app.disable('x-powered-by');

// ----------------------- SERVER HEADERS ----------------------
  app.use((req:any, res:any, next:any) => {
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
  app.use((req:any, res:any) => res.status(404).json({
    message: 'Not Found',
    status: 404
  }));
};

export default expressConfig;
