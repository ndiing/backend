const express = require("express");

const router = express.Router();
router.use("/name", require("./name"));

module.exports = router;
