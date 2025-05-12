import Joi from 'joi';
import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;

const userRegisterSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, default: "" },
    email: { type: String, required: true },
    mobile: { type: String, default: "" },
    password: { type: String, default: "" },
    gender: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    address: { type: String, default: "" },
    fcm: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    role: { type: String, required: true, default: "user" }
}, { timestamps: true });

const userModel = model('users', userRegisterSchema);

const userRegisterValidation = Joi.object({
    fname: Joi.string().required().messages({
        'string.base': 'First name must be a string',
        'string.empty': 'First name is required',
        'any.required': 'First name is required'
    }),
    lname: Joi.string().optional().messages({
        'string.base': 'Last name must be a string',
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).optional().messages({
        'string.pattern.base': 'Please provide a valid mobile number',
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    gender: Joi.string().optional(),
    isActive: Joi.boolean().default(true),
});


const userLoginValidation = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    fcm: Joi.string().optional(),
    isActive: Joi.boolean().default(true)
});

const googleOAuthValidation = Joi.object({
    code: Joi.string().trim().required().messages({
        'string.empty': 'Authorization code is required',
        'string.email': 'Please provide a valid Authorization code',
        'any.required': 'Authorization code is required'
    }),
});


const subscribeUserSchema = new Schema({
    email: { type: String, required: true },
    isRegistered: { type: Boolean},
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

const subscribeUserModel = model('subscribe_users', subscribeUserSchema);

const subscribeUserValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Invalid email format.'
  }),
  isActive: Joi.boolean().optional(),
});


export default {
    userModel,
    userRegisterValidation,
    userLoginValidation,
    googleOAuthValidation,
    subscribeUserModel,
    subscribeUserValidation
};
