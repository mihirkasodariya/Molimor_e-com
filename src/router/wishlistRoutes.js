const express = require('express');
const router = express.Router();
const wishlistController = require('../controller/wishlistController');
const {validateAccessToken} = require("../middeleware/auth")

router.post('/addWishlist', validateAccessToken, wishlistController.addWishlist);
router.get('/getWishlist', validateAccessToken, wishlistController.getWishlist);
router.delete('/removeFromWishlist/:productId', validateAccessToken, wishlistController.removeFromWishlist);

module.exports = router;