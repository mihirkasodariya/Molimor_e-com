import Joi from 'joi';
import mongoose, { Schema as _Schema, model } from 'mongoose';
const { Schema } = mongoose;

const wishlistItemSchema = new Schema({
  productId: { type: _Schema.Types.ObjectId, ref: 'products', required: true },
  addedAt: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
}, { _id: true });

const wishlistSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  items: [wishlistItemSchema],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const wishlistModel = model('wishlist', wishlistSchema);

const wishlistActionValidation = Joi.object({
  productId: Joi.string().length(24).required().messages({
    'string.base': 'Product ID must be a string',
    'string.length': 'Product ID must be a valid 24-character ObjectId',
    'any.required': 'Product ID is required'
  })
});

export default {
  wishlistModel,
  wishlistActionValidation,
};
