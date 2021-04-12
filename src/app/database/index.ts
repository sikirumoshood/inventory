import config from '../../config';

const pgp = require('pg-promise');

const promise = require('bluebird');

const pg = pgp({ promiseLib: promise, noLocking: true });

//@ts-ignore
const inventoryDB = pg(config.DATABASE_URL);

export default inventoryDB;
