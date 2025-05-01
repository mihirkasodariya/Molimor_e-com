const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/wishlistController');
const {validateAccessToken} = require("../middeleware/auth")

router.post('/addWishlist', validateAccessToken, wishlistController.addWishlist); // user
router.get('/getWishlist', validateAccessToken, wishlistController.getWishlist); // user
router.delete('/removeFromWishlist/:productId', validateAccessToken, wishlistController.removeFromWishlist); // user

module.exports = router;