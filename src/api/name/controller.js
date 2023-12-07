// require
const Model = require("./model");
const Service = require("./service");
const Helper = require("./helper");

// class
class Controller {
    static async init(req, res, next) {
        try {
            next();
        } catch (error) {
            next(error);
        }
    }
}

// exports
module.exports = Controller;
