import Joi from 'joi';
import mongoose, { Schema, model } from 'mongoose';

const instaShopSchema = new Schema({
  image: { type: String, default: "" },
  url: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const instaShopModel = model('insta_shop', instaShopSchema);

const instaShopValidation = Joi.object({
  image: Joi.string().uri().allow("").messages({
    'string.uri': 'Image must be a valid URI',
  }),
  url: Joi.string().uri().required().messages({
    'string.base': 'URL must be a string',
    'string.uri': 'URL must be a valid URI',
    'any.required': 'URL is required',
    'string.empty': 'URL is required',
  }),
  isActive: Joi.boolean().default(true),
});

export {
  instaShopModel,
  instaShopValidation,
};
