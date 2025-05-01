const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const mediaSchema = new Schema({
  file: { type: String, required: true },
  type: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const mediaModel = mongoose.model('medias', mediaSchema);


const mediaValidation = Joi.object({
  image: Joi.array()
    .items(
      Joi.string().required().messages({
        'string.base': 'Each file must be a string.',
        'any.required': 'File name is required.'
      })
    )
    .min(1)
    .required()
    .messages({
      'array.base': 'Files must be an array.',
      'array.min': 'At least one file is required.',
      'any.required': 'Files are required.'
    }),
  type: Joi.string().optional().messages({
    'any.only': 'Type must be either "image" or "video".',
    'any.required': 'Type is required.'
  }),
  isDelete: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true)
});


const videoValidation = Joi.object({
  vdoUrl: Joi.string().min(1).required().messages({
      'string.base': 'Video URL must be a valid string.',
      'string.empty': 'Video URL cannot be empty.',
      'string.min': 'Video URL must be at least 1 character long.',
      'any.required': 'Video URL is required.'
    }),

  type: Joi.string().optional().messages({
      'any.only': 'Type must be either "image" or "video".',
      'any.required': 'Type is required when specified.'
    }),

  isDelete: Joi.boolean().default(false).messages({
      'boolean.base': 'Delete flag must be a boolean value.'
    }),

  isActive: Joi.boolean().default(true).messages({
      'boolean.base': 'Active flag must be a boolean value.'
    })
});




const mediaIdValidation = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'string.base': 'Banner ID must be a string',
      'any.required': 'Banner ID is required'
    })
});

const mediaActiveValidation = Joi.object({
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
  mediaModel,
  mediaValidation,
  videoValidation,
  mediaIdValidation,
  mediaActiveValidation
};
