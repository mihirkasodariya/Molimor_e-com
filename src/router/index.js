const express = require('express');
const router = express.Router();

router.use('/user', require('./userRoutes'));
router.use('/product', require('./productRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/subCategory', require('./subCategoryRoutes'));
router.use('/wishlist', require('./wishlistRoutes'));
router.use('/cart', require('./cartRoutes'));



module.exports = router;