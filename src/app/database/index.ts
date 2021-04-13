import config from '../../config';

const pgp = require('pg-promise');

const promise = require('bluebird');

const pg = pgp({ promiseLib: promise, noLocking: true });

const connectionOptions = {
    //@ts-ignore
    connectionString: config.DATABASE_URL,
    max: 10
};

const inventoryDB = pg(connectionOptions);

export default inventoryDB;
