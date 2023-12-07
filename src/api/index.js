// require
const express = require("express");

// router
const router = express.Router();

// use
router.use("/name", require("./name"));

// exports
module.exports = router;
