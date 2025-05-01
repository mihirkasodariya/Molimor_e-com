const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth")

router.post('/addReview', validateAccessToken, reviewController.addReview); // user
router.delete('/admin/inActiveReview/:id', validateAccessToken, authorizeRoles('admin'), reviewController.inActiveReview); // admin

module.exports = router;