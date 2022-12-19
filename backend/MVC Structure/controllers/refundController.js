const axios = require("axios")
const logger = require("../../modules/el")
const Transaction = require("../models/transaction")

const initiateRefund = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/payment/refund",
      headers: {
        accept: "application/json",
        Authorization: req.session.bkash_token,
        "X-APP-Key": process.env.BKASH_API_KEY,
        "content-type": "application/json",
      },
      data: {
        paymentID: req.body.paymentID,
        trxID: req.body.trxID,
        amount: req.body.amount,
        reason: req.body.reason,
        sku: req.body.invoiceNumber,
      },
    }

    const refundedTransaction = await axios.request(options)
    if (refundedTransaction.data.statusCode == 0000) {
      const updated = await Transaction.updateOne(
        {
          paymentID: req.body.paymentID,
        },
        {
          $set: {
            refundStatus: "Completed",
            refundTrxID: refundedTransaction.data.refundTrxID,
            refundAmount: refundedTransaction.data.amount,
          },
        }
      )
      if (updated.modifiedCount == 1) {
        res.json({
          success: true,
          refundedTransaction: refundedTransaction.data,
        })
      } else {
        throw new Error("Couldn't update refund info")
      }
    } else {
      res.json({
        success: false,
        error: {
          message: refundedTransaction.data.statusMessage,
        },
      })
    }
  } catch (error) {
    return error
  }
}

const getRefundStatus = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/payment/refund",
      headers: {
        accept: "application/json",
        Authorization: req.session.bkash_token,
        "X-APP-Key": process.env.BKASH_API_KEY,
        "content-type": "application/json",
      },
      data: {
        paymentID: req.body.paymentID,
        trxID: req.body.trxID,
      },
    }

    const refundedTransactionStatus = await axios.request(options)
    if (refundedTransactionStatus.data.statusCode == 0000) {
      res.json({
        success: true,
        refundedTransactionStatus: refundedTransactionStatus.data,
      })
    } else {
      res.json({
        success: false,
        error: {
          message: refundedTransactionStatus.data.statusMessage,
        },
      })
    }
  } catch (error) {
    return error
  }
}

module.exports = {
  initiateRefund,
  getRefundStatus,
}
