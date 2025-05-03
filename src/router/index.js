import { Router } from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import subCategoryRoutes from './subCategoryRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';
import cartRoutes from './cartRoutes.js';
import orderRoutes from './orderRoutes.js';
import bannerRoutes from './bannerRoutes.js';
import certificateRoutes from './certificateRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import aboutRoutes from './aboutRoutes.js';
import contactRoutes from './contactUsRoutes.js';

const router = Router();

router.use('/user', userRoutes);
router.use('/product', productRoutes);
router.use('/category', categoryRoutes);
router.use('/subCategory', subCategoryRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/cart', cartRoutes);
router.use('/order', orderRoutes);
router.use('/banner', bannerRoutes);
router.use('/certificate', certificateRoutes);
router.use('/media', mediaRoutes);
router.use('/review', reviewRoutes);
router.use('/about', aboutRoutes);
router.use('/contact', contactRoutes);

export default router;
