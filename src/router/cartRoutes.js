const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const {validateAccessToken} = require("../middeleware/auth")

router.post('/addToCart', validateAccessToken, cartController.addToCart); // user
router.get('/getUserCart', validateAccessToken, cartController.getUserCart); // user
router.put('/updateCartByProductId/:productId', validateAccessToken, cartController.updateCartByProductId); // user
router.delete('/deleteCartByProductId/:productId', validateAccessToken, cartController.deleteCartByProductId); // user

module.exports = router;