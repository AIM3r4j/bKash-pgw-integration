const express = require("express")
const router = express.Router()

const authenticate = require("./middlewares/authenticator")
const checkBkashTokenStatus = require("./middlewares/checkBkashTokenStatus")

const loginRoutes = require("./routes/loginRoutes")

const credentialManagementRoutes = require("./routes/credentialManagementRoutes")
const provisionRoutes = require("./routes/provisionRoutes")
const deprovisionRoutes = require("./routes/deprovisionRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const transactionsRoutes = require("./routes/transactionsRoutes")
const refundRoutes = require("./routes/refundRoutes")

router.use("/payment", authenticate, checkBkashTokenStatus, paymentRoutes)
router.use(
  "/transactions",
  authenticate,
  checkBkashTokenStatus,
  transactionsRoutes
)
router.use("/refund", authenticate, checkBkashTokenStatus, refundRoutes)
router.use("/provision", authenticate, provisionRoutes)
router.use("/deprovision", authenticate, deprovisionRoutes)
router.use("/manage/credential", authenticate, credentialManagementRoutes)

router.use("/login", loginRoutes)

router.use("*", (req, res) => {
  res.status("404").json({
    errorMessage: "404 - Not Found",
  })
})

module.exports = router
