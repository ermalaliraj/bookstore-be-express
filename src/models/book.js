const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    stockQuantity: {
      type: Number,
      required: true
    }
  }
);

module.exports = mongoose.model('Book', bookSchema);