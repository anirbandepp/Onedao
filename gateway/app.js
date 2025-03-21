const express = require('express');

const userRouter = require('../routes/userRouter');
const authRouter = require('../routes/authRouter');
const productRouter = require('../routes/productRouter');

const globalErrorHandler = require('../middlewares/globalErrorHandler');

const app = express();

app.use(express.json());

// Routes
app.get('/', (req, res, next) => {
    res.json({ msg: "Hello" });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;