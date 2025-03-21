// *** Third Party Packages
const createHttpError = require("http-errors");
const otpGenerator = require('otp-generator');
const JWT = require('jsonwebtoken');

// *** Import Models
const User = require("../models").User;
const UserOTP = require("../models").UserOTP;

// *** Import Helpers
const { hashPassword, comparePassword } = require("../utils/authHelper");
const OTPSender = require("../utils/mailSendHandler");
const checkUserLocation = require("../utils/unauthorisedCountry");

const createUser = async (req, res, next) => {
    try {

        const isUSerrestricted = await checkUserLocation();

        if (isUSerrestricted) {
            const error = createHttpError(400, "Your country is restricted!!!");
            return next(error);
        }

        const { name, email, password } = req.body;

        // *** Validation
        if (!name || !email || !password) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        // *** Check if user already exist
        const userExists = await User.findOne({ where: { email } });

        if (userExists) {
            const error = createHttpError(400, "User already exist");
            return next(error);
        }

        // *** Generate a 4-digit OTP
        const otp = otpGenerator.generate(4, {
            digits: true,
            alphabets: false,
            upperCase: false,
            specialChars: false,
        });
        await OTPSender(email, otp);

        // *** Store OTP
        const storeOTP = new UserOTP({ email, OTP: otp });
        await storeOTP.save();

        // *** Generate Hashed Password
        const hashedPassword = await hashPassword(password);

        // *** Store new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        // *** Send Response
        return res.status(201).json({
            success: true,
            message: 'Registered successfully, next step verify your mail id.'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const verifyUser = async (req, res, next) => {
    try {

        const { email, OTP } = req.body;

        // *** Validation
        if (!email || !OTP) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        // TODO: Check if OTP is valid or not
        // *** Check if user already exist
        const isValid = await UserOTP.findOne({
            where: { email, OTP },
            order: [['createdAt', 'DESC']],
        });

        if (!isValid) {
            const error = createHttpError(400, "OTP is not valid");
            return next(error);
        }

        // TODO: Marked user as verified
        const verifyUser = User.update(
            { verified: true },
            { where: { email } }
        )

        if (!verifyUser) {
            const error = createHttpError(400, "Failed to verify user");
            return next(error);
        }

        // TODO: Generate Token 
        const user = await User.findOne({ where: { email } });

        // *** Generate Token
        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // *** Send Response
        return res.status(200).json({
            success: true,
            message: "User verified successfully",
            token
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        // *** Validation
        if (!email || !password) {
            const error = createHttpError(400, "All fields are required");
            return next(error);
        }

        // *** Check if user 
        const user = await User.findOne({ where: { email, verified: true } });

        if (!user) {
            const error = createHttpError(404, "Email is not registered");
            return next(error);
        }

        // *** Compare user entered password
        const match = await comparePassword(password, user.password);

        if (!match) {
            const error = createHttpError(404, "Invalid Password");
            return next(error);
        }

        // *** Generate Token
        const token = JWT.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // *** Send Response
        return res.status(200).json({
            success: true,
            message: "User Logged in successfully",
            token
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { createUser, verifyUser, login }