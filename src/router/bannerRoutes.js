import { Router } from 'express';
const router = Router();
import { addBanner, getAllBanner, adminGetAllBanner, deleteBannerById, inActiveBannerById } from '../controller/bannerController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import { bannerImage } from "../utils/multerStorage.js";


router.post('/addBanner', bannerImage.single('image'), validateAccessToken, authorizeRoles("admin"), addBanner); // admin
router.get('/getAllBanner', getAllBanner);  // user

router.get('/admin/adminGetAllBanner', validateAccessToken, authorizeRoles("admin"), adminGetAllBanner);  // admin
router.delete('/deleteBannerById/:id', validateAccessToken, authorizeRoles("admin"), deleteBannerById); // admin
router.put('/inActiveBannerById/:id', validateAccessToken, authorizeRoles("admin"), inActiveBannerById); // admin

export default router;