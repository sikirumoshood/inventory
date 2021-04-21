import express from 'express';
import expressConfig from './config/express';
import config from './config';
import logger from './config/logger';

const os = require("os");
const cluster = require("cluster");
const port = process.env.PORT || 3023;
let server: any = null;
const startNewApp = (clusterSize:number): any => {
    const app = express();
    expressConfig(app)
    server = app.listen(port,function () { logger.info(`Inventory service listening on port ${port} with the ${clusterSize > 1 ? 'multiple' : 'single' } worker ${process.pid}`)})
    return app;
};

const clusterWorkerSize:number = os.cpus().length
let app = null;

// @ts-ignore
if (clusterWorkerSize > 2 && config.ENVIRONMENT !== 'test' ) {
  if (cluster.isMaster) {
    // Distribute load accross cpu cores
    for (let i=0; i < clusterWorkerSize - 1; i++) {
      cluster.fork()
    }

    cluster.on("exit", function(worker:any) {
      console.log("Worker", worker.id, " has exitted.")
    })
  } else {
    app = startNewApp(clusterWorkerSize);
  }
} else {
    app = startNewApp(1);
};


export { app, server };
