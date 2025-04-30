const { userModel, userRegisterValidation, userLoginValidation, googleOAuthValidation } = require('../model/userModel');
const { generateJWToken } = require("../middeleware/auth")
const response = require('../utils/response');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res) => {
    const { fname, lname, email, mobile, password, gender, profilePhoto } = req.body;
    const { error } = userRegisterValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const userExists = await userModel.findOne({ email });
        if (userExists?.email) {
            return response.error(res, 409, 'User Alredy Register', {});
        };
        const hashedPassword = await bcrypt.hash(password, 10);
        const createNewUser = new userModel({
            ...req.body,
            profilePhoto: req.file?.filename,
            password: hashedPassword
        });
        await createNewUser.save();
        const token = await generateJWToken({ _id: createNewUser._id });
        return response.success(res, 200, 'User Register Successfully', { _id: createNewUser._id, token: token });
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    const { error } = userLoginValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const user = await userModel.findOne({ email, isActive: true });
        if (!user) {
            return response.error(res, 403, 'Account not found. Please check the email entered.');
        };
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return response.error(res, 401, 'Incorrect password. Please try again.');
        };
        const token = await generateJWToken({ id: user._id });
        return response.success(res, 200, 'You have successfully logged in', { _id: user._id, token: token });

    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.profile = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.user.id }).select('-password');
        if (!user) {
            return response.error(res, 403, 'User not found.');
        };
        const updatedUser = {
            ...user._doc,
            profilePhoto: user?.profilePhoto ? `/userProfile/${user?.profilePhoto}` : null
        };
        return response.success(res, 200, 'Retrieve user profile successful', updatedUser);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.updateProfile = async (req, res) => {
    try {
        const { fname, lname, mobile, gender } = req.body;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    fname: fname ?? req.user?.fname,
                    lname: lname ?? req.user?.lname,
                    mobile: mobile ?? req.user?.mobile,
                    gender: gender ?? req.user?.gender,
                    profilePhoto: req.file?.filename ?? user?.profilePhoto
                }
            },
            { new: true, runValidators: true }
        );
        return response.success(res, 200, 'User profile updated successfully.', updatedUser);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.getGoogleOAuthUrl = async (req, res) => {
    try {
        const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&scope=openid%20email%20profile`;
        return response.success(res, 200, 'Google OAuth URL generated successfully. Please proceed with the login process', { url: redirectUrl });
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.googleOAuthLogin = async (req, res) => {
    const axios = require('axios');

    const { code } = req.body;

    const { error } = googleOAuthValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    const decodedCode = decodeURIComponent(code);
    try {
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code: decodedCode,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URL,
            grant_type: 'authorization_code'
        });
        const { access_token } = tokenResponse.data;

        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const user = userInfoResponse.data;
        let createNewUser = await userModel.findOne({ email: user.email })
        if (!createNewUser) {
            let createNewUser = new userModel({
                fname: user.given_name,
                lname: user.family_name,
                email: user.email,
                profilePhoto: user.picture,
            });
            await createNewUser.save();
        };
        let token = await generateJWToken({ id: createNewUser._id });
        return response.success(res, 200, 'Google authentication successful.', { _id: createNewUser._id, token: token });
    } catch (error) {
        if (error.response?.data?.error === 'invalid_grant' || error.response?.data?.error_description === 'Bad Request') {
            return response.error(res, 403, 'Authorization code expired. Please try again.', {});
        };
        console.error('Google signup error:', error.response.data.error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};


module.exports.getFacebookOAuthUrl = async (req, res) => {
    try {
        const redirectUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${FACEBOOK_REDIRECT_URI}&scope=email`;
        return response.success(res, 200, 'Facebook OAuth URL generated successfully. Please proceed with the login process', { url: redirectUrl });
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.facebookOAuthLogin = async (req, res) => {
    const { code } = req.query;
    try {
        const tokenResponse = await axios.get('https://graph.facebook.com/v13.0/oauth/access_token', {
            params: {
                client_id: FACEBOOK_APP_ID,
                client_secret: FACEBOOK_APP_SECRET,
                code: code,
                redirect_uri: FACEBOOK_REDIRECT_URI
            }
        });
        const { access_token } = tokenResponse.data;
        const userResponse = await axios.get('https://graph.facebook.com/v13.0/me', {
            params: {
                access_token: access_token,
                fields: 'id,name,email'
            }
        });
        const userData = userResponse.data;
        res.send(`Hello ${userData.name}!`);
    } catch (error) {
        console.error("Facebook Authentication Error:", error);
        res.status(500).send('Authentication failed.');
    };
};
