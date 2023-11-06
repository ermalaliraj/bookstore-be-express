const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    //TODO this should be ref, for test purpose setting as String
    userId: {
      type: String,
      required: true
    },
    // userId: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true
    // },
    quantity: {
      type: Number,
      required: true
    },
    transactionDate: {
      type: Date,
      required: false
    },
  },
  {timestamps: true}
)

module.exports = mongoose.model('Transaction', transactionSchema)
