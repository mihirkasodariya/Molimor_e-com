import { Router } from 'express';
const router = Router();
import { addMedia, addVideoUrl, adminGetAllMedia, getAllMedia, deleteMediaById, inActiveMediaById, addSocialAccountURL, getSocialAccountURL } from '../controller/mediaController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import { mediaFile } from "../utils/multerStorage.js";


router.post('/admin/addMedia', mediaFile.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), addMedia); // admin
router.post('/admin/addVideoUrl', validateAccessToken, authorizeRoles("admin"), addVideoUrl); // admin

router.get('/admin/getAllMedia/:type', validateAccessToken, authorizeRoles("admin"), adminGetAllMedia); // admin
router.get('/getAllMedia/:type', validateAccessToken, getAllMedia); // user

router.delete('/admin/deleteMediaById/:id', validateAccessToken, authorizeRoles("admin"), deleteMediaById); // admin
router.put('/admin/inActiveMediaById/:id', validateAccessToken, authorizeRoles("admin"), inActiveMediaById); // admin


router.post("/admin/addSocialAccountURL", validateAccessToken, authorizeRoles('admin'), addSocialAccountURL); // admin || fb, insta, X, etc...
router.get("/getSocialAccountURL", validateAccessToken, getSocialAccountURL);  // user

export default router;
