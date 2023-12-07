// require
const express = require("express");
const Controller = require("./controller");

// router
const router = express.Router();

// use
router.use(Controller.init);

// exports
module.exports = router;
