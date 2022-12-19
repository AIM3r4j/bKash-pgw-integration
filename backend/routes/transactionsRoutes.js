const router = require("express").Router()
const transactionsController = require("../MVC Structure/controllers/transactionsController")

router.post("/search", transactionsController.searchTransaction)
router.get("/fetch", transactionsController.fetchTransactions)

module.exports = router
