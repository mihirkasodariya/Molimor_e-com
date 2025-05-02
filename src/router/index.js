const express = require('express');
const router = express.Router();

router.use('/user', require('./userRoutes'));
router.use('/product', require('./productRoutes'));
router.use('/category', require('./categoryRoutes'));
router.use('/subCategory', require('./subCategoryRoutes'));
router.use('/wishlist', require('./wishlistRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/order', require('./orderRoutes'));
router.use('/banner', require('./bannerRoutes'));
router.use('/certificate', require('./certificateRoutes'));
router.use('/media', require('./mediaRoutes'));
router.use('/review', require('./reviewRoutes'));
router.use('/about', require('./aboutRoutes'));
router.use('/contact', require('./contactUsRoutes'));



module.exports = router;