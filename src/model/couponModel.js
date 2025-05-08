import Joi from 'joi';
import mongoose, { model } from 'mongoose';

const { Schema } = mongoose;

const couponSchema = new Schema({
    code: { type: String, required: true, unique: true },
    description: { type: String },
    discountType: { type: String, required: true }, // percentage' ?? fixed
    discountValue: { type: Number, required: true },
    minPurchase: { type: Number },
    maxPurchase: { type: Number },
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const couponModel = model('Coupons', couponSchema);

const couponValidation = Joi.object({
    code: Joi.string().required().messages({
        'string.base': 'Coupon code must be a string',
        'string.empty': 'Coupon code is required',
        'string.min': 'Coupon code must be at least 3 characters',
        'any.required': 'Coupon code is required'
    }),
    description: Joi.string().max(100).allow('', null).messages({
        'string.base': 'Description must be a string',
        'string.max': 'Description cannot exceed 100 characters',
    }),
    discountType: Joi.string().required().messages({
        'any.required': 'Discount type is required'
    }),
    discountValue: Joi.number().positive().required().messages({
        'number.base': 'Discount value must be a number',
        'number.positive': 'Discount value must be a positive number',
        'any.required': 'Discount value is required'
    }),
    minPurchase: Joi.number().min(0).allow(null).messages({
        'number.base': 'Minimum purchase must be a number',
        'number.min': 'Minimum purchase must be at least 0'
    }),
    maxPurchase: Joi.number().min(0).allow(null).messages({
        'number.base': 'Maximum purchase must be a number',
        'number.min': 'Maximum purchase must be at least 0'
    }),
    validFrom: Joi.date().required().messages({
        'date.base': 'Valid From must be a valid date',
        'any.required': 'Valid From date is required'
    }),
    validTo: Joi.date().required().messages({
        'date.base': 'Valid To must be a valid date',
        'any.required': 'Valid To date is required'
    }),
    isActive: Joi.boolean().default(true),
});


const couponIdValidation = Joi.object({
    id: Joi.string().length(24).required().messages({
        'string.base': 'Product ID must be a string',
        'string.length': 'Product ID must be a valid 24-character ObjectId',
        'any.required': 'Product ID is required'
    })
});

export default {
    couponModel,
    couponValidation,
    couponIdValidation,
};
