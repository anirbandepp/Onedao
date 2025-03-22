// *** Import Third Party Packages
const { Op } = require('sequelize');
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

        let { page, limit, sortBy, order, minPrice, maxPrice, search } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;
        const offset = (page - 1) * limit;
        order = order || "DESC"; // ASC or DESC

        // Where clause for filtering
        let where = {};

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) {
                where.price = {
                    [Op.gte]: parseFloat(minPrice)
                }
            }
            if (maxPrice) {
                where.price = {
                    [Op.lte]: parseFloat(maxPrice)
                }
            }
        }

        if (minPrice && maxPrice) {
            where = {
                price: {
                    [Op.gte]: parseFloat(minPrice),
                    [Op.lte]: parseFloat(maxPrice)
                }
            };
        }

        if (search) {
            where.name = { $like: `%${search}%` }; // Case-insensitive search
        }

        // *** Find Product belongs to logged in user
        where.user_id = req.user_id;

        // *** Fetch All product created by loggedin User
        const { count, rows } = await Product.findAndCountAll({
            where,
            limit,
            offset,
            order: [[sortBy || "createdAt", order.toUpperCase()]],
        });

        // *** Send Response
        return res.status(200).json({
            total: count,
            per_page: limit,
            current_page: page,
            total_pages: Math.ceil(count / limit),
            data: rows,
        });

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

const bulkUpload = async (req, res, next) => {
    try {
        for (let i = 0; i < 100; i++) {
            const insertProduct = new Product({
                name: `user-${i}`,
                description: `desc-${i}`,
                price: 100 * i,
                qty: 10 * i,
                user_id: req?.user_id
            });
            await insertProduct.save();
        }

        // *** Send Response
        return res.status(201).json({
            success: true,
            message: 'Bulk Product created successfully'
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

module.exports = { create, viewAll, viewSingle, update, destroy, bulkUpload };