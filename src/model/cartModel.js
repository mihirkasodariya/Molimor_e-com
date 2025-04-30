const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true, default: 1 },
    isDelete: { type: Boolean, default: false }
},{ timestamps: true })

const cartSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
    items: [cartItemSchema],
    isActive: { type: Boolean, default: true },
});

const cartModel = mongoose.model('cart', cartSchema);

const cartItemValidation = Joi.object({
    productId: Joi.string().length(24).required().messages({
        'string.base': 'Product ID must be a string',
        'string.length': 'Product ID must be a valid 24-character ObjectId',
        'any.required': 'Product ID is required'
    }),
    quantity: Joi.number().integer().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1'
    }),
    isDelete: Joi.boolean().default(false)
});

const cartValidation = Joi.object({
    items: Joi.array().items(cartItemValidation).min(1).required().messages({
        'array.base': 'Items must be an array',
        'array.min': 'At least one item is required',
        'any.required': 'Items are required'
    }),
    isActive: Joi.boolean().default(true)
});

const updateCartValidation = Joi.object({
    quantity: Joi.number().integer().messages({
        'number.base': 'Quantity must be a number',
        'number.min': 'Quantity must be at least 1'
    }),
    isActive: Joi.boolean().default(true)
});


module.exports = {
    cartModel,
    cartValidation,
    updateCartValidation
};
