import Joi from 'joi';
import mongoose, { Schema as _Schema, model } from 'mongoose';
const { Schema } = mongoose;

const saleProductSchema = new Schema({
    productId: { type: _Schema.Types.ObjectId, ref: 'products' },
    salePrice: { type: Number, default: 0},
    isSale: { type: Boolean, default: false },
    startSaleOn: { type: Date },
    endSaleOn: { type: Date, },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const productSaleModel = model('sale_products', saleProductSchema);

const saleProductValidation = Joi.object({
    productId: Joi.string().length(24).optional().messages({
        'string.base': 'Product ID must be a string',
        'string.length': 'Product ID must be a valid MongoDB ObjectId',
        'any.required': 'Product ID is required',
    }),
    salePrice: Joi.number().positive().optional().messages({
        'number.base': 'Sale Price must be a number',
        'number.positive': 'Sale Price must be greater than 0',
        'any.required': 'Sale Price is required',
    }),
    isSale: Joi.boolean().optional().messages({
        'boolean.base': 'isSale must be true or false',
        'any.required': 'isSale is required',
    }),
    startSaleOn: Joi.date().optional().messages({
        'date.base': 'startSaleOn must be a valid date',
    }),
    endSaleOn: Joi.date().optional().messages({
        'date.base': 'endSaleOn must be a valid date',
    }),
    isActive: Joi.boolean().optional().messages({
        'boolean.base': 'isActive must be true or false',
    }),
});

export default {
    productSaleModel,
    saleProductValidation,
};