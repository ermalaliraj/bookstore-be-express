const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const logger = require('./utils/logger')
const GenericError = require('./error/GenericError')
const bookRoutes = require('./routes/book')
const transactionRoutes = require('./routes/transaction')
require('dotenv').config()
require('./config/db')

const app = express()

app.use(cors())
app.use(bodyParser.json()) 

// ping route
app.get("/", (req, res) => {
  res.status(200).json({message: "Api un and running!"})
})

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next();
});

app.use(bookRoutes)
app.use(transactionRoutes)

//error handling
app.use((error, req, res, next) => {
  logger.error("Unhandled data:", error)
  const status = error.statusCode || 500
  const message = error.message
  if (error instanceof GenericError) {
    return res.status(400).json({errorCode: error.getCode(), message: message})
  } else {
    res.status(status).json({errorCode: 500, message: message})
  }
})

module.exports = app