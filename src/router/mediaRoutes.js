const express = require('express');
const router = express.Router();
const mediaController = require('../controller/mediaController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth")
const { mediaFile } = require("../utils/commonFunctions");


router.post('/admin/addMedia', mediaFile.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), mediaController.addMedia); // admin
router.post('/admin/addVideoUrl', validateAccessToken, authorizeRoles("admin"), mediaController.addVideoUrl); // admin

router.get('/admin/getAllMedia/:type', validateAccessToken, authorizeRoles("admin"), mediaController.adminGetAllMedia); // admin
router.get('/getAllMedia/:type', validateAccessToken, mediaController.getAllMedia); // user

router.delete('/admin/deleteMediaById/:id', validateAccessToken, authorizeRoles("admin"), mediaController.deleteMediaById); // admin
router.put('/admin/inActiveMediaById/:id', validateAccessToken, authorizeRoles("admin"), mediaController.inActiveMediaById); // admin


router.post("/admin/addSocialAccountURL", validateAccessToken, authorizeRoles('admin'), mediaController.addSocialAccountURL); // admin || fb, insta, X, etc...
router.get("/getSocialAccountURL", validateAccessToken, mediaController.getSocialAccountURL);  // user

module.exports = router;
