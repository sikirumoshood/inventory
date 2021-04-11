import express from 'express';
import expressConfig from './config/express';
import logger from './config/logger';

const port = process.env.PORT || 3023;

const app = express();

expressConfig(app);

app.listen(port);

logger.info(`Inventory service started on port ${port}`);

export default app;
