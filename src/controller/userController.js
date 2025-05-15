import model from '../model/userModel.js';
const { userModel, userRegisterValidation, userLoginValidation, googleOAuthValidation, subscribeUserModel, subscribeUserValidation, shopNowEmailButtonModel } = model
import auth from "../middeleware/auth.js";
const { generateJWToken } = auth;
import response from '../utils/response.js';
import { hash, compare } from 'bcrypt';
import axios from 'axios';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;
import { sendEmail } from '../utils/sendEmail.js';
// import welcomeEmailTemplate from '../../template/email/welcomeEmailTemplate.html'

export async function register(req, res) {
    const { fname, email, password } = req.body;
    const { error } = userRegisterValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    // const mail = await sendEmail(
    //     "welcomeEmailTemplate.html",
    //     fname,
    //     email,
    //     "Welcome to Molimore - Let's Build Something Beautiful Together!",
    //     // htmlTemplatePath: `${}`, // Full path to the template file
    //     "mihir test text"
    // );
    // console.log('mail', mail)
    try {
        const userExists = await userModel.findOne({ email });
        if (userExists?.email) {
            return response.error(res, req?.languageCode, resStatusCode.CONFLICT, resMessage.USER_FOUND, {});
        };
        const hashedPassword = await hash(password, 10);
        const createNewUser = new userModel({
            ...req.body,
            password: hashedPassword
        });
        await createNewUser.save();
        const token = await generateJWToken({ _id: createNewUser._id });
        const getEmailShopNowButton = await shopNowEmailButtonModel?.findOne({ isActive: true, for:"welcomeEmail" });

        const data = {
            name: fname,
            productImage1: process.env.IMAGE_PATH + "/aboutusImage/" + getEmailShopNowButton?.image[0],
            productImage2: process.env.IMAGE_PATH + "/aboutusImage/" + getEmailShopNowButton?.image[1],
            shopNow: getEmailShopNowButton?.url,
        };
        const mail = await sendEmail(
            "welcomeEmailTemplate.ejs",
            email,
            "Welcome to Molimor",
            `Hi ${fname}`,
            data
        );
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_REGISTER, { _id: createNewUser._id, token: token });
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function login(req, res) {
    const { email, password } = req.body;
    const { error } = userLoginValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const user = await userModel.findOne({ email, isActive: true });
        if (!user) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.USER_ACCOUNT_NOT_FOUND, {});
        };
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return response.error(res, req.languageCode, resStatusCode.UNAUTHORISED, resMessage.USER_ACCOUNT_NOT_FOUND, {});
        };
        const token = await generateJWToken({ id: user._id, role: 'user' });
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.LOGIN_SUCCESS, { _id: user._id, token: token });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function adminLogin(req, res) {
    const { email, password, fcm } = req.body;
    const { error } = userLoginValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const user = await userModel.findOne({ email: email, isActive: true, role: 'admin' });
        console.log('user', user)
        if (!user) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.USER_ACCOUNT_NOT_FOUND, {});
        };
        const validPassword = await compare(password, user.password);
        if (!validPassword) {
            return response.error(res, req.languageCode, resStatusCode.UNAUTHORISED, resMessage.USER_ACCOUNT_NOT_FOUND, {});
        };
        await userModel.findByIdAndUpdate(user._id, { $set: { fcm } }, { new: true });
        const token = await generateJWToken({ id: user._id, role: 'admin' });
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.LOGIN_SUCCESS, { _id: user._id, token: token });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function profile(req, res) {
    try {
        const user = await userModel.findById({ _id: req.user.id }).select('-password');
        if (!user) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
        };
        const updatedUser = {
            ...user._doc,
            profilePhoto: user?.profilePhoto ? `/userProfile/${user?.profilePhoto}` : null
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.RETRIEVE_PROFILE_SUCCESS, updatedUser);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateProfile(req, res) {
    try {
        const { fname, lname, mobile, gender, address } = req.body;
        const user = await userModel.findById({ _id: req.user.id });
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user.id,
            {
                $set: {
                    fname: fname ?? user?.fname,
                    lname: lname ?? user?.lname,
                    mobile: mobile ?? user?.mobile,
                    gender: gender ?? user?.gender,
                    address: address ?? user?.address,
                    profilePhoto: req.file?.filename ?? user?.profilePhoto
                }
            },
            { new: true, runValidators: true }
        );
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_PROFILE_UPDATED, updatedUser);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getGoogleOAuthUrl(req, res) {
    try {
        const redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URL}&scope=openid%20email%20profile`;
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.GOOGLE_OAUTH_URL_GENERATED, { url: redirectUrl });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function googleOAuthLogin(req, res) {

    const { code } = req.body;

    const { error } = googleOAuthValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
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
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.GOOGLE_AUTH_SUCCESS, { _id: createNewUser._id, token: token });
    } catch (error) {
        if (error.response?.data?.error === 'invalid_grant' || error.response?.data?.error_description === 'Bad Request') {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.AUTHORIZATION_CODE_EXPIRED, {});
        };
        console.error('Google signup error:', error.response?.data?.error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function getFacebookOAuthUrl(req, res) {
    try {
        const redirectUrl = `https://www.facebook.com/v13.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&scope=email`;
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, 'Facebook OAuth URL generated successfully. Please proceed with the login process', { url: redirectUrl });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function facebookOAuthLogin(req, res) {
    // try {
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code.' });
    };

    console.log('Received code:', code);
    console.log('Client ID:', process.env.FACEBOOK_APP_ID);
    console.log('Redirect URI:', process.env.FACEBOOK_REDIRECT_URI);
    console.log('FACEBOOK_APP_SECRET URI:', process.env.FACEBOOK_APP_SECRET);

    const tokenResponse = await axios.get('https://graph.facebook.com/v22.0/oauth/access_token?', {
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            code: code,
        },
    });

    const { access_token } = tokenResponse.data;
    console.log('Access Token:', access_token);

    const userResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
            access_token
        },
    });

    const userData = userResponse.data;
    console.log('User Data:', userData);

    return res.status(200).json({
        id: userData.id,
        name: userData.name,
        email: userData.email,
    });
};

export async function getUserById(req, res) {
    const id = req.params.id;

    try {
        const user = await userModel.findById(id).select('-password');
        if (!user) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
        };
        const updatedUser = {
            ...user._doc,
            profilePhoto: user.profilePhoto ? `/userProfile/${user.profilePhoto}` : null
        };
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USERS_FETCHED, updatedUser);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateUserById(req, res) {
    const id = req.params.id;
    const updateData = req.body;
    try {
        const updatedUser = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');

        if (!updatedUser) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_PROFILE_UPDATED, {
            ...updatedUser._doc,
            profilePhoto: updatedUser.profilePhoto ? `/userProfile/${updatedUser.profilePhoto}` : null
        });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveUserById(req, res) {
    const id = req.params.id;
    const isActive = req.body.isActive;
    try {
        const inActiveUser = await userModel.findByIdAndUpdate(id, { isActive: isActive }, { new: true, runValidators: true }).select('-password');
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_INACTIVE, inActiveUser);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find({ role: "user" }).select('-password');

        if (!users || users.length === 0) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.USER_NOT_FOUND, {});
        };
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USERS_FETCHED, users);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function addSubscribeUser(req, res) {
    const { email } = req.body;

    const { error } = subscribeUserValidation.validate({ email });
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const existingUser = await userModel.findOne({ email });
        const isRegistered = !!existingUser;

        const userSubscribe = await subscribeUserModel.findOne({ email });
        let newSubscriber;
        if (!userSubscribe) {
            newSubscriber = new subscribeUserModel({
                email,
                isRegistered
            });
            await newSubscriber.save();
            const getEmailShopNowButton = await shopNowEmailButtonModel?.findOne({ isActive: true, for:"subscribeEmail" });

        const data = {
            // name: fname || "",
            productImage1: process.env.IMAGE_PATH + "/aboutusImage/" + getEmailShopNowButton?.image[0],
            productImage2: process.env.IMAGE_PATH + "/aboutusImage/" + getEmailShopNowButton?.image[1],
            shopNow: getEmailShopNowButton?.url,
        };
        await sendEmail(
            "subscribeEmail.ejs",
            email,
            "Thanks for Joining Molimor - You're Officially In",
            `Hi`,
            data
        );
        };
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_SUBSCRIBE_SUCCESS, newSubscriber);
    } catch (err) {
        console.error(err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllSubscribedUsers(req, res) {
    try {
        const filter = {};
        if (req.query.isRegistered !== undefined) {
            filter.isRegistered = req.query.isRegistered === 'true';
        };
        const subscribers = await subscribeUserModel.find(filter);
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.FETCH_SUCCESS, subscribers);
    } catch (err) {
        console.error(err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function addEmailShopNowButton(req, res) {
    const { url } = req.body;
    const images = req.files.image;

    try {
        let newSubscriber;
        const dataExist = await shopNowEmailButtonModel.findOne({isActive : true, for:"welcomeEmail"});

        const newImageFilenames = images.map(img => img.filename);

        if (!dataExist) {
            const existingImages = dataExist[0].image || [];

            let combinedImages = [...existingImages, ...newImageFilenames];

            combinedImages = combinedImages.slice(-2);

            newSubscriber = await shopNowEmailButtonModel.findOneAndUpdate({isActive : true, for:"welcomeEmail"}, {
                url,
                image: combinedImages
            }, { new: true });
        } else {
            newSubscriber = await shopNowEmailButtonModel.create({
                url,
                image: newImageFilenames.slice(0, 2)
            });
        };

        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_SUBSCRIBE_SUCCESS, newSubscriber);
    } catch (err) {
        console.error(err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
}

export async function addsubscribeEmailTemp(req, res) {
    const { url } = req.body;
    const images = req.files.image;

    try {
        let newSubscriber;
        const dataExist = await shopNowEmailButtonModel.findOne({isActive : true, for:"subscribeEmail"});

        const newImageFilenames = images.map(img => img.filename);

        console.log('dataExist',dataExist)
        if (dataExist !== null) {
            const existingImages = dataExist[0]?.image || [];;

            let combinedImages = [...existingImages, ...newImageFilenames];

            combinedImages = combinedImages.slice(-2);

            newSubscriber = await shopNowEmailButtonModel.findOneAndUpdate({isActive : true, for:"subscribeEmail"}, {
                url,
                image: combinedImages
            }, { new: true });
        } else {
            console.log('newImageFilenames', newImageFilenames)
            newSubscriber = await shopNowEmailButtonModel.create({
                url,
                image: newImageFilenames.slice(0, 2),
                for:"subscribeEmail"
            });
            console.log('newSubscriber', newSubscriber)
        };

        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_SUBSCRIBE_SUCCESS, newSubscriber);
    } catch (err) {
        console.error(err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
}



export async function getEmailShopNowButton(req, res) {
    try {
        const getEmailShopNowButton = await shopNowEmailButtonModel.findOne({ isActive: true });
        const resData = {
            image1: process.env.IMAGE_PATH + "/aboutusImage/" + getEmailShopNowButton.image[0],
            image2: process.env.IMAGE_PATH + "/aboutusImage/" + getEmailShopNowButton.image[1],
            url: getEmailShopNowButton.url
        }
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.USER_SUBSCRIBE_SUCCESS, resData);
    } catch (err) {
        console.error(err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};