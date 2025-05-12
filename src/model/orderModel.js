import Joi from 'joi';
import mongoose, { model } from 'mongoose';
const { Schema } = mongoose;


const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
  orderId: { type: Number, required: true, unique: true },
  fname: { type: String, required: true },
  lname: { type: String, required: true },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    discountValue: { type: Number },
    discountType: { type: String },
  }],
  paymentMethod: { type: String, required: true },
  shippingAddress: { type: Boolean, default: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: Number, required: true },
  streetAddress: { type: [String] },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  shippingCharge: { type: String, required: true },
  totalAmount: { type: Number, required: true, min: 1 },
  orderNote: { type: String, required: true, min: 1 },
  status: { type: String, default: 'Processing', required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const orderModel = model('orders', orderSchema);
const itemValidation = Joi.object({
  productId: Joi.string().length(24).required().messages({
    'string.base': 'Product ID must be a string',
    'string.length': 'Product ID must be a valid 24-character ObjectId',
    'any.required': 'Product ID is required'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be a number',
    'number.integer': 'Quantity must be an integer',
    'number.min': 'Quantity must be at least 1',
    'any.required': 'Quantity is required'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'Price must be a number',
    'number.min': 'Price cannot be negative',
    'any.required': 'Price is required'
  }),
  discountValue: Joi.number().min(0).optional().messages({
    'number.base': 'discountValue must be a number',
  }),
  discountType: Joi.string().optional().messages({
    'string.base': 'discountType must be a string',
  }),
});

const orderValidation = Joi.object({
  orderId: Joi.number().optional().messages({
    'string.base': 'orderId must be a string',
    'string.empty': 'orderId is required',
    'string.min': 'orderId must be at least 1 characters long',
    'any.required': 'orderId is required'
  }),
  fname: Joi.string().min(1).required().messages({
    'string.base': 'First Name must be a string',
    'string.empty': 'First Name is required',
    'string.min': 'First Name must be at least 1 characters long',
    'any.required': 'First Name is required'
  }),
  lname: Joi.string().min(1).required().messages({
    'string.base': 'Last Name must be a string',
    'string.empty': 'Last Name is required',
    'string.min': 'Last Name must be at least 1 characters long',
    'any.required': 'Last Name is required'
  }),
  cartItems: Joi.array().items(itemValidation).min(1).required().messages({
    'array.base': 'cartItems must be an array',
    'array.min': 'At least one item is required',
    'any.required': 'cartItems are required'
  }),
  paymentMethod: Joi.string().valid('cod').required().messages({
    'string.base': 'Payment Method must be a string',
    'any.only': 'Payment Method must be one of: Credit Card, Debit Card, PayPal, or Cash on Delivery',
    'any.required': 'Payment Method is required'
  }),
  shippingAddress: Joi.boolean().default(false),
  country: Joi.string().min(1).required().messages({
    'string.base': 'Country/Region must be a string',
    'string.min': 'Country/Region must be at least 1 characters',
    'any.required': 'Country/Region is required'
  }),
  state: Joi.string().min(1).required().messages({
    'string.base': 'States must be a string',
    'string.min': 'States must be at least 1 characters',
    'any.required': 'States is required'
  }),
  pincode: Joi.number().min(1).required().messages({
    'string.base': 'Pincode Number must be a Number',
    'string.min': 'Pincode Number must be at least 1 characters',
    'any.required': 'Pincode Number is required'
  }),
  streetAddress: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Shipping Address must be an array',
    'string.base': 'Each address must be a string',
    'any.required': 'Shipping Address is required'
  }),
  mobile: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    'string.empty': 'Mobile number is required',
    'string.pattern.base': 'Please provide a valid 10-digit mobile number',
    'any.required': 'Mobile number is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  shippingCharge: Joi.string().required().messages({
    'string.base': 'Shipping Charge must be a string',
    'string.empty': 'Shipping Charge is required',
    'any.required': 'Shipping Charge is required'
  }),
  orderNote: Joi.string().optional().messages({
    'string.base': 'Order Note must be a string',
  }),
  status: Joi.string().valid('Processing', 'Shipped', 'Delivered', 'Cancelled').default('Processing'),
  isActive: Joi.boolean().default(true)
});



const getOrderValidation = Joi.object({
  id: Joi.string().required().messages({
    'string.base': 'Order ID must be a string',
    'string.empty': 'Order ID is required',
    'any.required': 'Order ID is required'
  })
});
export default {
  orderModel,
  orderValidation,
  getOrderValidation
};
