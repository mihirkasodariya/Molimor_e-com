import { Router } from 'express';
const router = Router();
import { addBanner, getAllBanner, adminGetAllBanner, deleteBannerById, inActiveBannerById, addBannerForShopNow, getAllBannerForShopNow, deleteShopNowBannerById } from '../controller/bannerController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import { bannerImage } from "../utils/multerStorage.js";


router.post('/admin/addBanner/:id', bannerImage, validateAccessToken, authorizeRoles("admin"), addBanner); // admin
router.get('/getAllBanner', getAllBanner);  // user

router.get('/admin/adminGetAllBanner', validateAccessToken, authorizeRoles("admin"), adminGetAllBanner);  // admin
router.delete('/admin/deleteBannerById/:id', validateAccessToken, authorizeRoles("admin"), deleteBannerById); // admin
router.put('/admin/inActiveBannerById/:id', validateAccessToken, authorizeRoles("admin"), inActiveBannerById); // admin

router.post('/admin/addBannerForShopNow/:id', bannerImage, validateAccessToken, authorizeRoles("admin"), addBannerForShopNow); // admin
router.get('/getAllBannerForShopNow', getAllBannerForShopNow); // admin
router.delete('/admin/deleteShopNowBannerById', validateAccessToken, authorizeRoles("admin"), deleteShopNowBannerById); // admin
export default router;