import { Router } from 'express';
const router = Router();
import { addMedia, addVideoUrl, adminGetAllMedia, getAllMedia, deleteMediaById, inActiveMediaById, addSocialAccountURL, getSocialAccountURL, addMarketPlace, getMarketPlace, addInstaShop, getAllInstaShop } from '../controller/mediaController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import { mediaFile, marketPlacePhotos, instaShopImage } from "../utils/multerStorage.js";


router.post('/admin/addMedia', mediaFile.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), addMedia); // admin
router.post('/admin/addVideoUrl', validateAccessToken, authorizeRoles("admin"), addVideoUrl); // admin

router.get('/admin/getAllMedia/:type', validateAccessToken, authorizeRoles("admin"), adminGetAllMedia); // admin
router.get('/getAllMedia/:type', getAllMedia); // user

router.delete('/admin/deleteMediaById/:id', validateAccessToken, authorizeRoles("admin"), deleteMediaById); // admin
router.put('/admin/inActiveMediaById/:id', validateAccessToken, authorizeRoles("admin"), inActiveMediaById); // admin


router.post("/admin/addSocialAccountURL", validateAccessToken, authorizeRoles('admin'), addSocialAccountURL); // admin || fb, insta, X, etc...
router.get("/getSocialAccountURL", validateAccessToken, getSocialAccountURL);  // user

router.post("/admin/addMarketPlace", marketPlacePhotos.single('image'), validateAccessToken, authorizeRoles('admin'), addMarketPlace); // admin 
router.get("/getMarketPlace", getMarketPlace);  // user

// insta shop
router.post('/admin/addInstaShop', instaShopImage.single('image'), validateAccessToken, authorizeRoles("admin"), addInstaShop); // admin
router.get('/getAllInstaShop', getAllInstaShop); // user
export default router;
