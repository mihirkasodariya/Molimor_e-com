import Joi from 'joi';

import mongoose, { model, Schema as _Schema } from 'mongoose';
const { Schema } = mongoose;

const mediaSchema = new Schema({
  file: { type: String, required: true },
  type: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const mediaModel = model('medias', mediaSchema);


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
}, { timestamps: true });



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

// Social Account
const socialAccountSchema = new _Schema({
  facebook: { type: String },
  instagram: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  isActive: { type: Boolean, default: true, },
});

const socialAccountModel = model("social_accounts", socialAccountSchema);

const socialAccountValidation = Joi.object({
  facebook: Joi.string().optional().messages({
    "string.base": "Facebook link must be a valid string.",
    "string.empty": "Facebook link cannot be empty.",
    "any.required": "Facebook link is required.",
  }),
  instagram: Joi.string().optional().messages({
    "string.base": "Instagram handle must be a valid string.",
    "string.empty": "Instagram handle cannot be empty.",
    "any.required": "Instagram handle is required.",
  }),
  linkedin: Joi.string().optional().messages({
    "string.base": "LinkedIn profile must be a valid string.",
    "string.empty": "LinkedIn profile cannot be empty.",
    "any.required": "LinkedIn profile is required.",
  }),
  twitter: Joi.string().optional().messages({
    "string.base": "Twitter handle must be a valid string.",
    "string.empty": "Twitter handle cannot be empty.",
    "any.required": "Twitter handle is required.",
  }),
  isActive: Joi.boolean().default(true),
});


const marketPlaceSchema = new Schema({
  image: { type: String, required: true },
  link: { type: String, required: true },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const marketPlaceModel = model('market_place', marketPlaceSchema);


const marketPlaceValidation = Joi.object({
  image: Joi.string().required().messages({
    'string.base': 'Image must be a string',
    'any.required': 'Image is required'
  }),
  link: Joi.string().optional().messages({
    'string.base': 'Link must be a string'
  }),
  isDelete: Joi.boolean().default(false),
  isActive: Joi.boolean().default(true)
});


export default {
  mediaModel,
  mediaValidation,
  videoValidation,
  mediaIdValidation,
  mediaActiveValidation,

  socialAccountModel,
  socialAccountValidation,

  marketPlaceModel,
  marketPlaceValidation
};
