const Joi = require('joi');
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, },
    categoryId: {type: mongoose.Schema.Types.ObjectId,ref: "categorys",required: true,},
    isActive: { type: Boolean, default: true, },
  },
  {timestamps: true}
);
const subCategoryModel = mongoose.model("sub_categorys", subcategorySchema);


const subCategoryValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
     'string.base': 'Category Name must be a text value.',
     'string.empty': 'Category Name is required and cannot be empty.',
     'string.min': 'Category Name must be at least 3 characters long.',
     'string.max': 'Category Name cannot be longer than 100 characters.',
     'any.required': 'Category Name is required.'
   }),
   categoryId: Joi.string().min(3).max(30).required().messages({
       'string.base': 'Sub Category ID must be a text value.',
       'string.empty': 'Sub Category ID is required and cannot be empty.',
       'string.min': 'Sub Category ID must be at least 3 characters long.',
       'string.max': 'Sub Category ID cannot be longer than 30 characters.',
       'any.required': 'Sub Category ID is required.',
     }),
   isActive: Joi.boolean().valid(true, false).default(true).messages({
     'boolean.base': 'isActive must be either true or false.',
     'any.only': 'isActive must be either true or false.'
   })
});

const subCategoryIdValidation = Joi.object({
  id: Joi.string().min(3).max(100).required().messages({
    'string.base': 'Category ID must be a text value.',
    'string.empty': 'Category ID is required and cannot be empty.',
    'string.min': 'Category ID must be at least 3 characters long.',
    'string.max': 'Category ID cannot be longer than 100 characters.',
    'any.required': 'Category ID is required.',
  }),
});

const inActiveSubCategoryValidation = Joi.object({
  isActive: Joi.boolean().valid(true, false).default(true).messages({
    'boolean.base': 'isActive must be either true or false.',
    'any.only': 'isActive must be either true or false.'
  })
});

module.exports = {
  subCategoryModel,
  subCategoryValidation,
  subCategoryIdValidation,
  inActiveSubCategoryValidation
};