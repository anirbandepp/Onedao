const express = require('express');

const { create, viewAll, viewSingle, update, destroy } = require('../controllers/ProductController');
const authenticate = require('../middlewares/authMiddleware');

const productRouter = express.Router();

productRouter.post("/create", authenticate, create);

productRouter.get("/view-all", authenticate, viewAll);

productRouter.get("/view-single/:id", authenticate, viewSingle);

productRouter.put("/update", authenticate, update);

productRouter.delete("/destroy/:id", authenticate, destroy);

module.exports = productRouter;