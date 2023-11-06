require("./src/config/env");
const app = require("./src/app");
const db = require('./src/config/db')
const logger = require('./src/utils/logger')

app.start = async () => {
  try {
    await db.connect();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}.`);
    });
  } catch (err) {
    logger.error(`Error starting application: ${err}`);
  }
};

app.stop = async () => {
  try {
    logger.info('Received kill signal, shutting down gracefully');
    await db.disconnect();
    process.exit(0); // for test purpose simply shut don the process
  } catch (err) {
    logger.error(`Error Shutting Down the server${err}`);
  }
};

app.start()

module.exports = app ;