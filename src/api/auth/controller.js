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

    static async login(req,res,next){
        try {
            res.json({message:'login'})
        } catch (error) {
            next(error)
        }
    }
    static async verify(req,res,next){
        try {
            res.json({message:'verify'})
        } catch (error) {
            next(error)
        }
    }
    static async register(req,res,next){
        try {
            res.json({message:'register'})
        } catch (error) {
            next(error)
        }
    }
    static async logout(req,res,next){
        try {
            res.json({message:'logout'})
        } catch (error) {
            next(error)
        }
    }
    static async refresh(req,res,next){
        try {
            res.json({message:'refresh'})
        } catch (error) {
            next(error)
        }
    }
    static async revoke(req,res,next){
        try {
            res.json({message:'revoke'})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = Controller;
