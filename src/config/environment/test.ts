const test = {
    ENVIRONMENT: 'test',
    DATABASE_URL: process.env.TEST_DATABASE_URL,
    EXPIRED_INVENTORY_REMOVAL_INTERVAL: '*/1 * * * *' // Every minute
};
  
export default test;
  