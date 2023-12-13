const express = require("express");
const Controller = require("./controller");

const router = express.Router();
router.use(Controller.init);

router.post("/login", Controller.login);
router.post("/verify", Controller.verify);
router.post("/register", Controller.register);
router.post("/logout", Controller.logout);
router.post("/refresh", Controller.refresh);
router.post("/revoke", Controller.revoke);

module.exports = router;
