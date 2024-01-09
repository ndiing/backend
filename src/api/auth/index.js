const express = require("express");
const Controller = require("./controller");

const router = express.Router();
router.use(Controller.init);

// router.post("/send-otp", Controller.sendOtp)
// router.post("/validate-otp", Controller.validateOtp)
// router.post("/generate-token", Controller.generateToken)
// router.post("/revoke-token", Controller.revokeToken)

module.exports = router;
