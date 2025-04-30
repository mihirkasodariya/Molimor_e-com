const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { saveUserProfile }  = require('../utils/commonFunctions')
const {validateAccessToken} = require("../middeleware/auth")

router.post('/register', saveUserProfile.single('profilePhoto'), userController.register);
router.post('/login', userController.login); 
router.get('/profile', validateAccessToken, userController.profile);
router.put('/updateProfile', validateAccessToken, saveUserProfile.single('profilePhoto'), userController.updateProfile);


router.get('/getGoogleOAuthUrl', userController.getGoogleOAuthUrl); 
router.post('/googleOAuthLogin', userController.googleOAuthLogin);

router.post('/getFacebookOAuthUrl', userController.getFacebookOAuthUrl);
router.post('/facebookOAuthLogin', userController.facebookOAuthLogin);





module.exports = router;