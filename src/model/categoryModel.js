import Joi from 'joi';
import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const categoryModel = model("categorys", categorySchema);

const categoryValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Category Name must be a text value.',
    'string.empty': 'Category Name is required and cannot be empty.',
    'string.min': 'Category Name must be at least 3 characters long.',
    'string.max': 'Category Name cannot be longer than 100 characters.',
    'any.required': 'Category Name is required.'
  }),
  isActive: Joi.boolean().valid(true, false).default(true).messages({
    'boolean.base': 'isActive must be either true or false.',
    'any.only': 'isActive must be either true or false.'
  }),
});

const categoryIdValidation = Joi.object({
  id: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Category ID must be a text value.',
    'string.empty': 'Category ID is required and cannot be empty.',
    'string.min': 'Category ID must be at least 3 characters long.',
    'string.max': 'Category ID cannot be longer than 100 characters.',
    'any.required': 'Category ID is required.',
  }),
});

const categoryInActiveValidation = Joi.object({
  id: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Category ID must be a text value.',
    'string.empty': 'Category ID is required and cannot be empty.',
    'string.min': 'Category ID must be at least 3 characters long.',
    'string.max': 'Category ID cannot be longer than 100 characters.',
    'any.required': 'Category ID is required.',
  }),
  isActive: Joi.boolean().valid(true, false).default(true).messages({
    'boolean.base': 'isActive must be either true or false.',
    'any.only': 'isActive must be either true or false.'
  }),
});

export default {
  categoryModel,
  categoryValidation,
  categoryIdValidation,
  categoryInActiveValidation
};
