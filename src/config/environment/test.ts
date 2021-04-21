const test = {
    ENVIRONMENT: 'test',
    DATABASE_URL: process.env.DATABASE_URL,
    EXPIRED_INVENTORY_REMOVAL_INTERVAL: '*/30 * * * *' // Every 30 minute
};
  
export default test;
  