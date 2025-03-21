// *** Import Models
const User = require("../models").User;

// *** Third Party Packages
const JWT = require('jsonwebtoken');
const createHttpError = require("http-errors");

const authenticate = async (req, res, next) => {
    try {
        if (!req?.header("Authorization")) {
            return next(createHttpError(401, "Authorization token is required."));
        }
        const token = req?.headers?.authorization?.split(" ")[1]
        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user_id = decode?.id;
        next();
    } catch (error) {
        console.log(error);
        const httpError = createHttpError(401, "Unauthorized access denied");
        return next(httpError);
    }
}

module.exports = authenticate;