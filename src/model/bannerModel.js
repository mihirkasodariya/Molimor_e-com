import Joi from 'joi';
import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const bannerSchema = new Schema({
  image: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'products' },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const bannerModel = model('banners', bannerSchema);

const bannerValidation = Joi.object({
  image: Joi.string().required().messages({
    'string.base': 'Image must be a string',
    'any.required': 'Image is required'
  }),
  productId: Joi.string().optional().messages({
    'string.base': 'Product ID must be a string',
  }),
  isDelete: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true)
});

const bannerIdValidation = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'Banner ID must be a string',
      'any.required': 'Banner ID is required'
    })
});

const bannerActiveValidation = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'Banner ID must be a string',
      'any.required': 'Banner ID is required'
    }),
  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'isActive must be a boolean (true or false)',
      'any.required': 'isActive is required'
    })
});


const shopBannerSchema = new Schema({
  image: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'products' },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const shopBannerModel = model('shop_banners', shopBannerSchema);


const shopBannerValidation = Joi.object({
  image: Joi.string().required().messages({
    'string.base': 'Image must be a string',
    'any.required': 'Image is required',
  }),
  productId: Joi.string().optional().messages({
    'string.base': 'Product ID must be a string',
  }),
  isDelete: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true),
});


export default {
  bannerModel,
  bannerValidation,
  bannerIdValidation,
  bannerActiveValidation,

  shopBannerModel,
  shopBannerValidation,
};
