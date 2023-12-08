const Model = require("./model");
const Service = require("./service");
const Helper = require("./helper");
class Controller {
    static async init(req, res, next) {
        try {
            next();
        } catch (error) {
            next(error);
        }
    }
}
module.exports = Controller;
