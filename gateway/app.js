const express = require('express');
const cors = require('cors');

const userRouter = require('../routes/userRouter');
const authRouter = require('../routes/authRouter');
const productRouter = require('../routes/productRouter');

const configure = require('../bootstrap/config');
const globalErrorHandler = require('../middlewares/globalErrorHandler');

const app = express();

app.use(
    cors({
        origin: configure.frontendDomain,
    })
);

app.use(express.json());

// Routes
app.get('/', (req, res, next) => {
    return res.json({ msg: "Please refer to API End points" });
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;