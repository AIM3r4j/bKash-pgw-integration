const mongoose = require("mongoose")
const Schema = mongoose.Schema

const transactionSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  walletNumber: {
    type: String,
    default: null,
  },
  paymentID: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  transactionID: {
    type: String,
    default: null,
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    required: true,
  },
  initiatedAt: {
    type: String,
    required: true,
  },
  executedAt: {
    type: String,
    default: null,
  },
  refundStatus: {
    type: String,
    default: null,
  },
  refundTrxID: {
    type: String,
    default: null,
  },
  refundAmount: {
    type: String,
    default: null,
  },
})

const Transaction = mongoose.model("transaction", transactionSchema)
module.exports = Transaction
