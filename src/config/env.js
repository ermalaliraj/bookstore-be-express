const dotenv = require('dotenv')
const path = require("path")
const logger = require('../utils/logger')

const setupEnv = () => {
  logger.info(`Running in '${process.env.NODE_ENV}' environment`)
  let envFile
  if (process.env.NODE_ENV) {
    envFile = `.env.${process.env.NODE_ENV}`
  } else {
    envFile = `.env`
  }

  try {
    envFile = path.resolve(__dirname + "/../../", envFile)
    logger.info(`Using config file '${envFile}'`)
    const vars = dotenv.config({path: envFile})
    logger.info("Variables: ", vars.parsed)
  } catch (e) {
    logger.error(`Error fetching file in path '${envFile}'. \nError: ${e.stack}`)
  }
}

setupEnv()