require("./src/config/env");
const app = require("./src/app");
const db = require('./src/config/db')
const logger = require('./src/utils/logger')


const start = async () => {
  try {
    await db.connect();
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}.`);
    });
  } catch (err) {
    logger.error(`Error connecting to MongoDB ${err}`);
  }
};

start()


module.exports = app ;
