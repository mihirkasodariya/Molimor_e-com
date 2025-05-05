import { Router } from 'express';
const router = Router();
import { addCertificate, getAllCertificate, adminGetAllCertificate, deleteCertificateById, inActiveCertificateById } from '../controller/certificateController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import { certificateImage } from "../utils/multerStorage.js";


router.post('/addCertificate', certificateImage.single('image'), validateAccessToken, authorizeRoles("admin"), addCertificate); // admin
router.get('/getAllCertificate', validateAccessToken, getAllCertificate); // user
router.get('/admin/getAllCertificate', validateAccessToken, authorizeRoles("admin"), adminGetAllCertificate); // admin
router.delete('/deleteCertificateById/:id', validateAccessToken, authorizeRoles("admin"), deleteCertificateById); // admin
router.put('/inActiveCertificateById/:id', validateAccessToken, authorizeRoles("admin"), inActiveCertificateById); // admin

export default router;