// *** Import Third Party Packages
const createHttpError = require("http-errors");

// *** Import Models
const Product = require("../models").Product;

// *** Import Product Validation Schema
const { productSchema } = require("../validation/ProductValidation");

// *** Import Helpers
const logger = require("../utils/logger");

const create = async (req, res, next) => {
    try {

        // validation the schema
        const { error } = productSchema(req.body);

        if (error) {
            logger.warn("Product Creating validation error", error.details[0].message);

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }

        // *** Save new product
        const { name, description, price, qty } = req.body;

        const insertProduct = new Product({
            name, description, price, qty, user_id: req?.user_id
        });
        await insertProduct.save();

        if (!insertProduct) {
            const error = createHttpError(400, "Failed to create product");
            return next(error);
        }

        // *** Send Response
        return res.status(201).json({
            success: true,
            message: 'Product created successfully'
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const viewAll = async (req, res, next) => {
    try {

        // *** Fetch All product created by loggedin User
        const result = await Product.findAll();

        return res.json({
            success: true,
            message: "All Product fetched successfully",
            result
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const viewSingle = async (req, res, next) => {
    try {

        const { id } = req.params;

        if (!id) {
            const error = createHttpError(400, "Not a valid request");
            return next(error);
        }

        const result = await Product.findOne({
            where: { id }
        });

        if (!result) {
            const error = createHttpError(400, "Failed to fetch product");
            return next(error);
        }

        return res.json({
            success: true,
            message: "Product fetched successfully",
            result
        })

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const update = async (req, res, next) => {
    try {

        // *** Save new product
        const { id, name, description, price, qty } = req.body;


        // *** validation the schema
        const { error } = productSchema({ name, description, price, qty });

        if (error) {
            logger.warn("Product updating validation error", error.details[0].message);

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            })
        }

        // *** Update Process
        const updateQuery = Product.update(
            { name, description, price, qty },
            {
                where: { id },
                returning: true,
            }
        )

        if (!updateQuery) {
            const error = createHttpError(400, "Failed to update product");
            return next(error);
        }

        // *** Send Response
        return res.status(201).json({
            success: true,
            message: 'Product updated successfully',
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
}

const destroy = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            const error = createHttpError(400, "Not a valid request");
            return next(error);
        }

        const result = await Product.destroy({
            where: { id, user_id: req.user_id }
        });

        if (!result) {
            const error = createHttpError(400, "Failed to fetch product");
            return next(error);
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            result
        })
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { create, viewAll, viewSingle, update, destroy };