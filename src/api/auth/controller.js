const Model = require("./model");
const Service = require("./service");
const Helper = require("./helper");
const { default: Store } = require("../../lib/store");
const crypto = require("crypto");
const JWT = require("../../lib/jwt");
const OTP = require("../../lib/otp");
const config = require("../../lib/config");
const moment = require("moment");

class Controller {
    // init
    static async init(req, res, next) {
        try {
            next();
        } catch (error) {
            next(error);
        }
    }

    // login
    static async login(req, res, next) {
        try {
            res.json({ message: "login" });
        } catch (error) {
            next(error);
        }
    }

    // verify
    static async verify(req, res, next) {
        try {
            res.json({ message: "verify" });
        } catch (error) {
            next(error);
        }
    }

    // register
    static async register(req, res, next) {
        try {
            res.json({ message: "register" });
        } catch (error) {
            next(error);
        }
    }

    // logout
    static async logout(req, res, next) {
        try {
            res.json({ message: "logout" });
        } catch (error) {
            next(error);
        }
    }

    // refresh
    static async refresh(req, res, next) {
        try {
            res.json({ message: "refresh" });
        } catch (error) {
            next(error);
        }
    }

    // revoke
    static async revoke(req, res, next) {
        try {
            res.json({ message: "revoke" });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;
