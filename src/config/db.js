const _ = require('lodash')
const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const logger = require('../utils/logger')

mongoose.isEqual = (id1, id2) => {
  return mongoose.getObjectId(id1) === mongoose.getObjectId(id2)
}

mongoose.getObjectId = obj => {
  if (!obj) {
    return null
  }
  if (typeof obj === 'string') {
    return obj
  }
  if (typeof obj === ObjectId) {
    return obj.toString()
  }
  if (obj._id) {
    return obj._id.toString()
  }
  return obj.toString()
}

mongoose.parseFields = (query, refsFieldsStr) => {
  if (!refsFieldsStr) {
    return query.select('-__v')
  }

  let refsFieldsArray = _.isString(refsFieldsStr) ? refsFieldsStr.split(' ') : refsFieldsStr
  let fields = []
  _.each(refsFieldsArray, reffields => {
    let reffieldsParts = reffields.split(':')
    if (reffieldsParts.length >= 2) {
      let refName = _.head(reffieldsParts)
      let refFields = _.tail(reffieldsParts, 1).join(' ')
      query = query.populate(refName, refFields)
    } else {
      fields.push(reffields)
    }
  })

  return query.select(fields)
}

mongoose.isObjectId = val => {
  if (!val) {
    return false
  }
  return val.toString().match(/^[a-z|\d]{24}$/)
}

let conn = mongoose.connection

exports.connect = () => {
  logger.info(`Mongo url: ${process.env.MONGO_URI}`);
  mongoose.connect(process.env.MONGO_URI
  //     {
  //   // useNewUrlParser: true,
  //   // useUnifiedTopology: true,
  //   // useCreateIndex: true
  // }
  );
  logger.info(`Opened connection to MongoDb`);
}

exports.disconnect = () => {
  return conn.close()
}

conn.on('connected', () => {
  logger.info(`Connected to mongodb (on confirmation), dbUrl=${process.env.MONGO_URI}`)
})

conn.on('error', err => {
  logger.error('Error connecting to mongodb', err)
  throw err
})

conn.on('close', () => {
  logger.info('Mongodb connection closed')
})

conn.on('disconnected', () => {
  logger.info('Disconnected from mongodb')
})


