import Joi from 'joi';
import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    inquiryType: { type: String, required: true },
    moq: { type: Number },
  },
  { timestamps: true }
);

const contactModel = model("Contact", contactSchema);



const contactValidation = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.base': 'Name must be a string',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required'
    }),

  message: Joi.string()
    .min(5)
    .max(1000)
    .required()
    .messages({
      'string.min': 'Message must be at least 5 characters long',
      'string.max': 'Message cannot exceed 1000 characters',
      'any.required': 'Message is required'
    }),

  inquiryType: Joi.string()
    .required()
    .messages({
      'any.required': 'Inquiry type is required',
      'string.base': 'Inquiry type must be a string'
    }),

  moq: Joi.number()
    .optional()
    .messages({
      'number.base': 'MOQ must be a number'
    })
});




const companyInfoSchema = new Schema(
  {
    content: { type: String, required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, trim: true, lowercase: true },
  },
  { timestamps: true }
);
const companyinfoModel = model("company_info", companyInfoSchema);


const companyinfoValidation = Joi.object({
  content: Joi.string().max(200).required().messages({
    "string.base": "Content must be a string",
    "string.empty": "Content is required",
    "any.required": "Content is required",
  }),
  address: Joi.string().required().messages({
    "string.base": "Address must be a string",
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
  mobile: Joi.string()
    .required()
    .messages({
      "string.empty": "Mobile/Phone Number is required",
      "any.required": "Mobile/Phone Number is required",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
});

export default {
  contactModel,
  contactValidation,

  companyinfoModel,
  companyinfoValidation
};

