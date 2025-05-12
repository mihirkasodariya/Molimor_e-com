import { Router } from 'express';
const router = Router();
import { addCoupon, getCouponById, getAllCouponList, updateCouponById, deleteCouponById, validateCoupon } from '../controller/couponController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;


router.post('/admin/addCoupon', validateAccessToken, authorizeRoles('admin'), addCoupon); // admin
router.get('/getCouponById/:id', validateAccessToken, getCouponById); // both
router.get('/getAllCouponList', validateAccessToken, getAllCouponList); // both
router.put('/admin/updateCouponById/:id', validateAccessToken, authorizeRoles('admin'), updateCouponById); // admin
router.delete('/admin/deleteCouponById/:id', validateAccessToken, authorizeRoles('admin'), deleteCouponById); // admin

router.post('/validateCoupon', validateCoupon); // user


export default router;