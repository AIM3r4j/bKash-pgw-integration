const router = require("express").Router()
const paymentController = require("../MVC Structure/controllers/paymentController")

router.post("/create", paymentController.createPayment)
router.post("/delete", paymentController.deletePayment)
router.post("/execute", paymentController.executePayment)
router.post("/query", paymentController.queryPayment)

module.exports = router
