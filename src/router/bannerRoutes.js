const express = require('express');
const router = express.Router();
const bannerController = require('../controller/bannerController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth")
const {bannerImage} = require("../utils/commonFunctions");


router.post('/addBanner', bannerImage.single('image'), validateAccessToken, authorizeRoles("admin"), bannerController.addBanner); // admin
router.get('/getAllBanner', validateAccessToken, bannerController.getAllBanner);  // user

router.get('/admin/adminGetAllBanner', validateAccessToken, authorizeRoles("admin"), bannerController.adminGetAllBanner);  // admin
router.delete('/deleteBannerById/:id', validateAccessToken, authorizeRoles("admin"), bannerController.deleteBannerById); // admin
router.put('/inActiveBannerById/:id', validateAccessToken, authorizeRoles("admin"), bannerController.inActiveBannerById); // admin

module.exports = router;