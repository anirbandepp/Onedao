const nodemailer = require('nodemailer');
const logger = require('./logger');

async function OTPSender(receiverMail, otp) {
    try {
        // *** Send OTP to user
        const transporter = nodemailer.createTransport({
            name: "ONEDAO",
            host: process?.env?.MAIL_HOST,
            port: process?.env?.MAIL_PORT,
            secure: true,
            auth: {
                user: process?.env?.MAIL_USER,
                pass: process?.env?.MAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: process?.env?.MAIL_USER,
            to: receiverMail,
            subject: 'Your OTP for Registration',
            text: `Your OTP is: ${otp}`,
            priority: "high",
        });

        console.log(info);
    } catch (error) {
        console.log(error);
        logger.error(error);
    }
}

module.exports = OTPSender;