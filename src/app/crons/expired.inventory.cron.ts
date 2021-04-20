import CronScheduler from 'node-cron';
import config from '../../config';
import logger from '../../config/logger';
import db from '../database';
import moment from 'moment';
import query from '../queries/inventory';

class ExpiredInventoryCron {
    private scheduleInterval: string;
    private scheduler: any;

    constructor(interval:string, scheduler: any){
        if(!interval){
            throw new Error(`Interval must be provided to start the cron, received - [${interval}] `);
        }
        this.scheduleInterval = interval;
        this.scheduler = scheduler;
    }

    run () : void {
        db.none(query.deleteExpiredInventories)
            .then( () => logger.info(':::: Inventories deleted successfully, waiting for the next schedule ::::::')) 
            .catch((e:any) => console.log(e))
    }

    start (): any {
        logger.info(`::: Database cleanup routine has just been scheduled - [${moment().format('YYYY-MM-DD hh:mm:ss a')}] :::`)
        this.scheduler.schedule(this.scheduleInterval, this.run);
    }
}

// Start cron
// @ts-ignore
new ExpiredInventoryCron(config.EXPIRED_INVENTORY_REMOVAL_INTERVAL, CronScheduler).start();

