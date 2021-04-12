import express from 'express';
import expressConfig from './config/express';

const os = require("os");
const cluster = require("cluster");
const port = process.env.PORT || 3023;

const startNewApp = (clusterSize:number): any => {
    const app = express();
    expressConfig(app)
    app.listen(port,function () { console.log(`Inventory service listening on port ${port} with the ${clusterSize > 1 ? 'multiple' : 'single' } worker ${process.pid}`)})
    return app;
};

const clusterWorkerSize:number = os.cpus().length
let app = null;

if (clusterWorkerSize > 2) {
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
    app = startNewApp(clusterWorkerSize);
};


export default app;
