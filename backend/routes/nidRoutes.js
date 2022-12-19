const router = require("express").Router()
const nidController = require("../MVC Structure/controllers/nidController")

router.post("/modify", nidController.modifyNID)
router.get("/validate", nidController.getModifyQueue)
router.post("/validate", nidController.validateNID)

module.exports = router
