import { Router } from 'express';
const router = Router();
import { register, login, adminLogin, profile, updateProfile, getGoogleOAuthUrl, googleOAuthLogin, getFacebookOAuthUrl, facebookOAuthLogin, getAllUsers, getUserById, updateUserById, inActiveUserById, addSubscribeUser, getAllSubscribedUsers, addEmailShopNowButton, getEmailShopNowButton, addsubscribeEmailTemp} from '../controller/userController.js';
import { saveUserProfile, uploadEmailImages} from '../utils/multerStorage.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post('/register', register); // user //saveUserProfile.single('profilePhoto'),
router.post('/login', login); // user
router.post('/admin/login', adminLogin); // user
router.get('/profile', validateAccessToken, profile); // user
router.put('/updateProfile', validateAccessToken, saveUserProfile.single('profilePhoto'), updateProfile); // user

router.get('/getGoogleOAuthUrl', getGoogleOAuthUrl); // user
router.post('/googleOAuthLogin', googleOAuthLogin); // user

router.get('/getFacebookOAuthUrl', getFacebookOAuthUrl); // user
router.post('/facebookOAuthLogin', facebookOAuthLogin); // user


router.get('/getAllUsers', validateAccessToken, authorizeRoles('admin'), getAllUsers); // admin
router.get('/getUserById/:id', validateAccessToken, authorizeRoles('admin'), getUserById); // admin
router.put('/updateUserById/:id', validateAccessToken, authorizeRoles('admin'), saveUserProfile.single('profilePhoto'), updateUserById); // admin
router.delete('/inActiveUserById/:id', validateAccessToken, authorizeRoles('admin'), inActiveUserById); // admin

router.post('/addSubscribeUser', addSubscribeUser); // subscribe user 
router.get('/admin/getAllSubscribedUsers', getAllSubscribedUsers); // subscribe admin 


router.post('/admin/addEmailShopNowButton', uploadEmailImages, validateAccessToken, authorizeRoles('admin'), addEmailShopNowButton); // admin add  url using email send 
router.get('/getEmailShopNowButton', getEmailShopNowButton); // using email send 

router.post('/admin/addsubscribeEmailTemp', uploadEmailImages, validateAccessToken, authorizeRoles('admin'), addsubscribeEmailTemp); // admin add  url using email send 

export default router;