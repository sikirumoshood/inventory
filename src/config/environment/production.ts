const production = {
    ENVIRONMENT: 'production',
    DATABASE_URL: process.env.DATABASE_URL,
    EXPIRED_INVENTORY_REMOVAL_INTERVAL: '0 0 0 * *' // Every midnight
  };
  
  export default production;
