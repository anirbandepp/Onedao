const express = require('express');

const { createUser, verifyUser, login } = require('../controllers/UserController');

const userRouter = express.Router();

userRouter.post("/register", createUser);

userRouter.post("/verify-user", verifyUser);

userRouter.post("/login", login);

module.exports = userRouter;