const development = {
    ENVIRONMENT: 'development',
    DATABASE_URL: process.env.DEVELOPMENT_DATABASE_URL,
    EXPIRED_INVENTORY_REMOVAL_INTERVAL: '*/5 * * * *' // every 5 minutes
};
  
export default development;
