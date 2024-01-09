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
    static async init(req, res, next) {
        try {
            const access = config.accessControl.find((access) => access.method.test(req.method) && access.url.test(req.url));

            if (!access) {
                res.status(403);
                throw new Error(http.STATUS_CODES[403]);
            }

            const whitelist = access.whitelist.some((whitelist) => whitelist.test(req.ip));

            if (!whitelist) {
                res.status(403);
                throw new Error(http.STATUS_CODES[403]);
            }

            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
