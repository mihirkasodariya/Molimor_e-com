'use strict'
import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;
import model from '../model/userModel.js';
const { userModel } = model

const generateJWToken = async (payload) => {
    try {
        const secret = process.env.JWT_SECRET;
        const signOptions = {
            issuer: 'tracking',
            expiresIn: '30d'
        };
        payload.creationDateTime = Date.now();
        const token = sign(payload, secret, signOptions);
        return token;
    } catch (error) {
        return (error);
    };
};

const validateAccessToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;

        if (!token) {
            return res.status(401).json({ success: false, status: 401, message: 'No token provided!' });
        };
        const secret = process.env.JWT_SECRET;
        const verifyOptions = {
            issuer: 'tracking',
            expiresIn: '30d'
        };
        const decodedToken = verify(token, secret, verifyOptions);

        const rootUser = await userModel.findById({ _id: decodedToken._id });
        if (!rootUser) {
            return res.status(401).json({ success: false, status: 401, message: 'Unauthorized User' });
        };

        req.user = rootUser;
        console.log('Root User Id : ', req.user.id)
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(403).json({ success: false, status: 401, message: 'Invalid or Expired Token' });
    };
};

const authorizeRoles = (...allowedRoles) => {
    try {
        return (req, res, next) => {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ success: false, status: 0, message: 'Access Denied' });
            };
            next();
        };
    } catch (error) {
        return (error);
    };
};

const languageMiddleware = (req, res, next) => {
    let languageCode = req.query?.lang || 'en';
    req.languageCode = languageCode;
    next();
};

const setCurrency = (req, res, next) => {
    req.currency = req.query?.currency?.toUpperCase() || 'INR';
    next();
};




export default {
    generateJWToken,
    validateAccessToken,
    authorizeRoles,
    languageMiddleware,
    setCurrency
};
