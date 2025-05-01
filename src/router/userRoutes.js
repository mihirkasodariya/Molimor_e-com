const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { saveUserProfile } = require('../utils/commonFunctions')
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth")

router.post('/register', saveUserProfile.single('profilePhoto'), userController.register); // user
router.post('/login', userController.login); // user
router.get('/profile', validateAccessToken, userController.profile); // user
router.put('/updateProfile', validateAccessToken, saveUserProfile.single('profilePhoto'), userController.updateProfile); // user

router.get('/getGoogleOAuthUrl', userController.getGoogleOAuthUrl); // user
router.post('/googleOAuthLogin', userController.googleOAuthLogin); // user

router.post('/getFacebookOAuthUrl', userController.getFacebookOAuthUrl); // user
router.post('/facebookOAuthLogin', userController.facebookOAuthLogin); // user


router.get('/getAllUsers', validateAccessToken, authorizeRoles('admin'), userController.getAllUsers); // admin
router.get('/getUserById/:id', validateAccessToken, authorizeRoles('admin'), userController.getUserById); // admin
router.put('/updateUserById/:id', validateAccessToken, authorizeRoles('admin'), saveUserProfile.single('profilePhoto'), userController.updateUserById); // admin
router.delete('/inActiveUserById/:id', validateAccessToken, authorizeRoles('admin'), userController.inActiveUserById); // admin



module.exports = router;