const development = {
    ENVIRONMENT: 'development',
    DATABASE_URL: process.env.DATABASE_URL,
    EXPIRED_INVENTORY_REMOVAL_INTERVAL: '*/30 * * * *' // every 30 minutes
};
  
export default development;
