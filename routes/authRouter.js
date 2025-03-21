const express = require('express');

const { checkAuth } = require('../controllers/CheckAuthController');

const authenticate = require('../middlewares/authMiddleware');

const authRouter = express.Router();

authRouter.get("/check", authenticate, checkAuth);

module.exports = authRouter;