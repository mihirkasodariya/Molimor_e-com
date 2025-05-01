const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const certificateSchema = new Schema({
  image: { type: String, required: true },
  description: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const certificateModel = mongoose.model('crtification', certificateSchema);

const certificateValidation = Joi.object({
  image: Joi.string().required().messages({
    'string.base': 'Image must be a string',
    'any.required': 'Image is required'
  }),
  description: Joi.string().required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description is required',
    'any.required': 'Description is required',
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


module.exports = {
  certificateModel,
  certificateValidation,
  bannerIdValidation,
  bannerActiveValidation
};
