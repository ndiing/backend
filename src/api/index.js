const express = require("express");

const router = express.Router();
// router.use("/name", require("./name"));
router.use("/auth", require("./auth"));

module.exports = router;
