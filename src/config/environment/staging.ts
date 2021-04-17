const staging = {
    ENVIRONMENT: 'staging',
    DATABASE_URL: process.env.DATABASE_URL,
    EXPIRED_INVENTORY_REMOVAL_INTERVAL: '*/5 * * * *'
};
  
export default staging;
