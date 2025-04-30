const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
    title: { type: String, required: true },
    shortDescription: { type: String },
    isFeatured: { type: [String], required: true },
    weight: { type: String, required: true },
    price: { type: Number, required: true },
    mrp: { type: Number, required: true },
    description: { type: String, required: true },
    benefits: { type: String, required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'sub_categorys' },
    image: [{ type: String }],
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const productModel = mongoose.model('products', productSchema);

// addProduct
const productValidation = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
    }),
    shortDescription: Joi.string().allow('', null).max(400).messages({
        'string.base': 'Short description must be a string',
        'string.max': 'Short description cannot exceed 300 characters',
    }),
    isFeatured: Joi.array()
        .items(Joi.string().required())
        .max(6)
        .required()
        .messages({
            'array.base': 'Is Featured must be an array of strings',
            'array.max': 'Is Featured can have at most 6 items',
            'any.required': 'Is Featured is required',
            'string.empty': 'Each value in Is Featured must be a non-empty string',
            'string.base': 'Each value in Is Featured must be a string',
        }),

    weight: Joi.string().required().messages({
        'string.base': 'Weight must be a string',
        'string.empty': 'Weight is required',
        'any.required': 'Weight is required',
    }),
    price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be greater than 0',
        'any.required': 'Price is required',
    }),
    mrp: Joi.number().positive().required().messages({
        'number.base': 'MRP must be a number',
        'number.positive': 'MRP must be greater than 0',
        'any.required': 'MRP is required',
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    benefits: Joi.string().required().messages({
        'string.base': 'Benefits must be a string',
        'string.empty': 'Benefits is required',
        'any.required': 'Benefits is required',
    }),
    subCategoryId: Joi.string().required().messages({
        'string.base': 'Subcategory ID must be a string',
        'string.empty': 'Subcategory ID is required',
        'any.required': 'Subcategory ID is required',
    }),
    image: Joi.array()
        .items(Joi.string().pattern(/^[\w,\s-]+\.(jpg|jpeg|png|gif|webp)$/i).required().messages({
            'string.pattern.base': 'Each image must be a valid image filename (jpg, jpeg, png, gif, webp)',
            'string.empty': 'Image name cannot be empty',
            'string.base': 'Each image must be a string',
        })).max(5).messages({
            'array.base': 'Image must be an array',
            'array.max': 'You can upload a maximum of 5 images',
        }),
    sku: Joi.string().required().messages({
        'string.base': 'SKU must be a string',
        'string.empty': 'SKU is required',
        'any.required': 'SKU is required',
    }),
    stock: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Stock must be a number',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative',
    }),
    quantity: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity cannot be negative',
    }),
    isDelete: Joi.boolean().valid(true, false).default(false).messages({
        'any.only': 'Is Delete must be "true" or "false"',
    }),
    isActive: Joi.boolean().valid(true, false).default(true).messages({
        'boolean.base': 'Is Active must be true or false',
    }),
});

// upadte product
const updateProductValidation = Joi.object({
    title: Joi.string().min(3).max(200).required().messages({
        'string.base': 'Title must be a string',
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 3 characters',
        'string.max': 'Title cannot exceed 100 characters',
        'any.required': 'Title is required'
    }),
    shortDescription: Joi.string().allow('', null).max(400).messages({
        'string.base': 'Short description must be a string',
        'string.max': 'Short description cannot exceed 300 characters',
    }),
    isFeatured: Joi.array()
        .items(Joi.string().required())
        .max(6)
        .required()
        .messages({
            'array.base': 'Is Featured must be an array of strings',
            'array.max': 'Is Featured can have at most 6 items',
            'any.required': 'Is Featured is required',
            'string.empty': 'Each value in Is Featured must be a non-empty string',
            'string.base': 'Each value in Is Featured must be a string',
        }),

    weight: Joi.string().required().messages({
        'string.base': 'Weight must be a string',
        'string.empty': 'Weight is required',
        'any.required': 'Weight is required',
    }),
    price: Joi.number().positive().required().messages({
        'number.base': 'Price must be a number',
        'number.positive': 'Price must be greater than 0',
        'any.required': 'Price is required',
    }),
    mrp: Joi.number().positive().required().messages({
        'number.base': 'MRP must be a number',
        'number.positive': 'MRP must be greater than 0',
        'any.required': 'MRP is required',
    }),
    description: Joi.string().required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'any.required': 'Description is required',
    }),
    benefits: Joi.string().required().messages({
        'string.base': 'Benefits must be a string',
        'string.empty': 'Benefits is required',
        'any.required': 'Benefits is required',
    }),
    image: Joi.array()
        .items(Joi.string().pattern(/^[\w,\s-]+\.(jpg|jpeg|png|gif|webp)$/i).required().messages({
            'string.pattern.base': 'Each image must be a valid image filename (jpg, jpeg, png, gif, webp)',
            'string.empty': 'Image name cannot be empty',
            'string.base': 'Each image must be a string',
        })).max(5).messages({
            'array.base': 'Image must be an array',
            'array.max': 'You can upload a maximum of 5 images',
        }),
    stock: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Stock must be a number',
        'number.integer': 'Stock must be an integer',
        'number.min': 'Stock cannot be negative',
    }),
    quantity: Joi.number().integer().min(0).default(0).messages({
        'number.base': 'Quantity must be a number',
        'number.integer': 'Quantity must be an integer',
        'number.min': 'Quantity cannot be negative',
    }),
    isDelete: Joi.boolean().valid(true, false).default(false).messages({
        'any.only': 'Is Delete must be "true" or "false"',
    }),
    isActive: Joi.boolean().valid(true, false).default(true).messages({
        'boolean.base': 'Is Active must be true or false',
    }),
});

const productSearchValidation = Joi.object({
    searchProduct: Joi.string().required().messages({
        'string.empty': 'Search term is required.',
        'any.required': 'Search term is required.'
    }),
});


const productFileSchema = Joi.object({
    title: Joi.string().required(),
    shortDescription: Joi.string().optional(),
    description: Joi.string().required(),
    benefits: Joi.string().required(),
    weight: Joi.string().required(),
    price: Joi.number().required(),
    mrp: Joi.number().required(),
    sku: Joi.string().required(),
    stock: Joi.number().optional(),
    quantity: Joi.number().optional(),
    subCategoryId: Joi.string().required(),
    isActive: Joi.boolean().truthy(true).falsy(false).optional(),
    isFeatured1: Joi.string().optional(),
    isFeatured2: Joi.string().optional(),
    isFeatured3: Joi.string().optional(),
    isFeatured4: Joi.string().optional(),
    isFeatured5: Joi.string().optional(),
    isFeatured6: Joi.string().optional(),
    image1: Joi.string().allow('').optional(),
    image2: Joi.string().allow('').optional(),
    image3: Joi.string().allow('').optional(),
    image4: Joi.string().allow('').optional(),
    image5: Joi.string().allow('').optional(),
  });
module.exports = {
    productModel,
    productValidation,
    productSearchValidation,
    updateProductValidation,
    productFileSchema
};
