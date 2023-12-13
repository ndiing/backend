const Model = require("./model");
const Service = require("./service");
const Helper = require("./helper");
const { default: Store } = require("../../lib/store");
const crypto = require("crypto");
const http = require("http");
const JWT = require("../../lib/jwt");
const OTP = require("../../lib/otp");
const config = require("../../lib/config");
const moment = require("moment");

class Controller {
    static async init(req,res,next){
        try {
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller;
