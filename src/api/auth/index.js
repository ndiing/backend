const express = require("express");
const Controller = require("./controller");

const router = express.Router();
router.use(Controller.init);

// /otp
// /verify
// /token
// /revoke

module.exports = router;
