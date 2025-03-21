// *** Import Models
const User = require("../models").User;

// *** Third Party Packages
const createHttpError = require("http-errors");
const JWT = require('jsonwebtoken');

const checkAuth = async (req, res, next) => {
    try {
        return res.json({
            succcess: true,
            message: "Your are logged in."
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { checkAuth };