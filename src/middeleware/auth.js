const jwt = require('jsonwebtoken');
const { userModel } = require('../model/userModel');

const generateJWToken = async (payload) => {
    try {
        const secret = process.env.JWT_SECRET;
        const signOptions = {
            issuer: 'tracking',
            expiresIn: '30d'
        };
        payload.creationDateTime = Date.now();
        const token = jwt.sign(payload, secret, signOptions);
        return token;
    } catch (error) {
        return (error);
    };
};

const validateAccessToken = async (req, res, next) => {
    try {
        let token = req.headers.authorization || req.headers.Authorization;

        if (!token) {
            return res.status(401).json({ status: 401, message: 'No token provided!' });
        };
        const secret = process.env.JWT_SECRET;
        const verifyOptions = {
            issuer: 'tracking',
            expiresIn: '30d'
        };
        const decodedToken = jwt.verify(token, secret, verifyOptions);

        const rootUser = await userModel.findById({ _id: decodedToken.id });
        if (!rootUser) {
            return res.status(401).json({ status: 401, message: 'Unauthorized User' });
        };

        req.user = rootUser;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error.message);
        return res.status(403).json({ status: 401, message: 'Invalid or Expired Token' });
    };
};

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ status: 0, message: 'Access Denied' });
        };
        next();
    };
};

module.exports = {
    generateJWToken,
    validateAccessToken,
    authorizeRoles
};
