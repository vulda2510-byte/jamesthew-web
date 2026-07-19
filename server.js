require('dotenv').config();

const app = require('./src/app');

// Updated paths reflecting the new src/config/ directory
const logger = require('./src/config/logger');
const { testDbConnection } = require('./src/config/database'); 
const { connectRedis } = require('./src/config/redis');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize external connections
    await testDbConnection();
    await connectRedis();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
    });
  } catch (error) {
    logger.error('Failed to bootstrap application:', error);
    process.exit(1);
  }
};

startServer();