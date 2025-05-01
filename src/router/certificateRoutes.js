const express = require('express');
const router = express.Router();
const certificateController = require('../controller/certificateController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth")
const { certificateImage } = require("../utils/commonFunctions");


router.post('/addCertificate', certificateImage.single('image'), validateAccessToken, authorizeRoles("admin"), certificateController.addCertificate); // admin
router.get('/getAllCertificate', validateAccessToken, certificateController.getAllCertificate); // user
router.get('/admin/getAllCertificate', validateAccessToken, authorizeRoles("admin"), certificateController.adminGetAllCertificate); // admin
router.delete('/deleteCertificateById/:id', validateAccessToken, authorizeRoles("admin"), certificateController.deleteCertificateById); // admin
router.put('/inActiveCertificateById/:id', validateAccessToken, authorizeRoles("admin"), certificateController.inActiveCertificateById); // admin

module.exports = router;