require("dotenv").config()
const logger = require("../../modules/el")
const axios = require("axios")
const Transaction = require("../models/transaction")

const createPayment = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create",
      headers: {
        accept: "application/json",
        Authorization: req.session.bkash_token,
        "X-APP-Key": process.env.BKASH_API_KEY,
        "content-type": "application/json",
      },
      data: {
        mode: "0011",
        payerReference: req.session.username,
        // payerReference: "testuser1",
        callbackURL:
          process.env.NODE_ENV === "PROD"
            ? `${process.env.DOMAIN}/products`
            : `${process.env.BASE_URL}:${process.env.PORT || 9000}/products`,
        amount: req.body.product_price,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: `INV${Date.now()}`,
      },
    }

    const paymentCreated = await axios.request(options)
    const trx = new Transaction({
      // username: req.session.username,
      username: "testuser1",

      paymentID: paymentCreated.data.paymentID,
      amount: paymentCreated.data.amount,
      currency: paymentCreated.data.currency,
      invoiceNumber: paymentCreated.data.merchantInvoiceNumber,
      status: paymentCreated.data.transactionStatus,
      initiatedAt: paymentCreated.data.paymentCreateTime,
    })
    trx.save()
    if (paymentCreated.data.statusCode == 0000) {
      res.json({
        success: true,
        message: "Payment Created",
        bkashURL: paymentCreated.data.bkashURL,
      })
    } else {
      res.json({
        success: false,
        error: {
          message: paymentCreated.data.statusMessage,
        },
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const deletePayment = async (req, res) => {
  try {
    const deleted = await Transaction.deleteOne({
      paymentID: req.body.paymentID,
      status: "Initiated",
    })
    if (deleted.deletedCount == 1) {
      res.json({
        success: true,
        message: "Payment Deleted",
      })
    } else {
      res.json({
        success: false,
        error: {
          message: "Couldn't Delete Payment",
        },
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const executePayment = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute",
      headers: {
        accept: "application/json",
        Authorization: req.session.bkash_token,
        "X-APP-Key": process.env.BKASH_API_KEY,
        "content-type": "application/json",
      },
      data: { paymentID: req.body.paymentID },
    }
    const paymentExecuted = await Promise.race([
      axios.request(options),
      new Promise((resolve, reject) => {
        setTimeout(resolve, 30000, {
          data: { statusCode: "0101", statusMessage: "Request timed-out" },
        })
      }),
    ])
    if (paymentExecuted.data.statusCode == 0000) {
      const updated = await Transaction.updateOne(
        {
          paymentID: req.body.paymentID,
        },
        {
          $set: {
            walletNumber: paymentExecuted.data.customerMsisdn,
            transactionID: paymentExecuted.data.trxID,
            status: paymentExecuted.data.transactionStatus,
            executedAt: paymentExecuted.data.paymentExecuteTime,
          },
        }
      )
      if (updated.modifiedCount == 1) {
        res.json({
          success: true,
          message: "Payment Successful",
        })
      } else {
        throw new Error("Couldn't update payment info")
      }
    } else {
      res.json({
        success: false,
        error: {
          message: paymentExecuted.data.statusMessage,
        },
      })
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

const queryPayment = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/payment/status",
      headers: {
        accept: "application/json",
        Authorization: req.session.bkash_token,
        "X-APP-Key": process.env.BKASH_API_KEY,
        "content-type": "application/json",
      },
      data: { paymentID: req.body.paymentID },
    }

    const paymentStatus = await axios.request(options)
    if (
      paymentStatus.data.statusCode == "0000" &&
      paymentStatus.data.transactionStatus == "Complete"
    ) {
      const updated = await Transaction.updateOne(
        {
          paymentID: req.body.paymentID,
        },
        {
          $set: {
            walletNumber: paymentStatus.data.customerMsisdn,
            transactionID: paymentStatus.data.trxID,
            status: paymentStatus.data.transactionStatus,
            executedAt: paymentStatus.data.paymentExecuteTime,
          },
        }
      )
      if (updated.modifiedCount == 1) {
        res.json({
          success: true,
          message: "Payment Successful",
        })
      } else {
        throw new Error("Couldn't update payment info")
      }
    } else {
      const updated = await Transaction.updateOne(
        {
          paymentID: req.body.paymentID,
        },
        {
          $set: {
            status: "Failed",
          },
        }
      )
      if (updated.modifiedCount == 1) {
        res.json({
          success: false,
          error: {
            message: "Payment Failed, Please try again!",
          },
        })
      } else {
        throw new Error("Couldn't update payment info")
      }
    }
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = {
  createPayment,
  deletePayment,
  executePayment,
  queryPayment,
}
