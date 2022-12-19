const router = require("express").Router()
const refundController = require("../MVC Structure/controllers/refundController")

router.post("", refundController.initiateRefund)
router.post("/status", refundController.getRefundStatus)

module.exports = router
