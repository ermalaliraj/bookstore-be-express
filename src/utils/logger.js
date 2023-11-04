const appRoot = require('app-root-path');
const winston = require('winston')

const loggerConfig = {
  winston: {
    console: {
      colorize: true,
      stringify: false,
      prettyPrint: true,
      handleExceptions: true,
      level: 'debug',
    },
    file: {
      level: 'debug',
      filename:  `${appRoot}/logs/app.log`,
      handleExceptions: true,
      timestamp: true,
      json: false,
      showLevel: true,
      prettyPrint: true,
      maxsize: 5242880, // 5MB
      maxFiles: 100,
    },
    errorFile: {
      level: 'error',
      filename: `${appRoot}/logs/error.log`,
      handleExceptions: true,
      timestamp: true,
      json: false,
      showLevel: true,
      prettyPrint: true,
      maxsize: 5242880, // 5MB
      maxFiles: 100,
    }
  }
}

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console(loggerConfig.winston.console),
    // new (winston.transports.File)(loggerConfig.winston.file)
  ],
})

module.exports = logger
