const joi = require('joi');

const productSchema = (data) => {
    const schema = joi.object({
        name: joi.string().min(3).max(100).required(),
        description: joi.string().min(3).required(),
        price: joi.number().required(),
        qty: joi.number().integer().min(1).required()
    });

    return schema.validate(data);
}

module.exports = { productSchema };