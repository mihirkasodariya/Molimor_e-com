const Joi = require('joi');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userRegisterSchema = new Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, default: "" },
    password: { type: String, default: "" },
    gender: { type: String,  default: ""},
    profilePhoto: { type: String },
    isActive: { type: Boolean, default: true },
    role: {
        type: String,
        required: true,
        default: "user"
      }
}, { timestamps: true });

const userModel = mongoose.model('users', userRegisterSchema);

const userRegisterValidation = Joi.object({
    fname: Joi.string().min(3).max(30).required().messages({
        'string.base': 'First name must be a string',
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 3 characters',
        'any.required': 'First name is required'
    }),
    lname: Joi.string().min(3).max(50).required().messages({
        'string.base': 'Last name must be a string',
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 3 characters',
        'any.required': 'Last name is required'
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
        'string.empty': 'Mobile number is required',
        'string.pattern.base': 'Please provide a valid mobile number',
        'any.required': 'Mobile number is required'
    }),
    password: Joi.string().min(6).max(30).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    }),
    gender: Joi.string().required().messages({
        'any.required': 'Gender is required',
    }),
    isActive: Joi.boolean().default(true)
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
    isActive: Joi.boolean().default(true)
});

const googleOAuthValidation = Joi.object({
    code: Joi.string().trim().required().messages({
        'string.empty': 'Authorization code is required',
        'string.email': 'Please provide a valid Authorization code',
        'any.required': 'Authorization code is required'
    }),
});

module.exports = {
    userModel,
    userRegisterValidation,
    userLoginValidation,
    googleOAuthValidation
};
