const logger = require("../../modules/el")
const Transaction = require("../../MVC Structure/models/transaction")
const axios = require("axios")

const fetchTransactions = async (req, res) => {
  try {
    const transactionsRows = await Transaction.find().count()
    const transactions = await Transaction.find().sort({ initiatedAt: -1 })
    res.json({
      success: true,
      message: "Transactions Fetched",
      transactions: transactions,
      rowCount: transactionsRows,
    })
  } catch (error) {
    return error
  }
}

const searchTransaction = async (req, res) => {
  try {
    const options = {
      method: "POST",
      url: "https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/general/searchTransaction",
      headers: {
        accept: "application/json",
        Authorization: req.session.bkash_token,
        "X-APP-Key": process.env.BKASH_API_KEY,
        "content-type": "application/json",
      },
      data: { trxID: req.body.trxID },
    }

    const searchedTransaction = await axios.request(options)
    if (searchedTransaction.data.statusCode == 0000) {
      res.json({
        success: true,
        transaction: searchedTransaction.data,
      })
    } else {
      res.json({
        success: false,
        error: {
          message: searchedTransaction.data.statusMessage,
        },
      })
    }
  } catch (error) {
    return error
  }
}

module.exports = {
  fetchTransactions,
  searchTransaction,
}
