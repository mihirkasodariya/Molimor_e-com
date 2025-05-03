import { Router } from 'express';
const router = Router();
import { placeOrder, getAllUserOrders, getOrderById, getAllOrders, updateOrderStatusByAdmin, assignOrderCourierPatner } from '../controller/orderController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post('/placeOrder', validateAccessToken, placeOrder); // user
router.get('/getAllUserOrders', validateAccessToken, getAllUserOrders); // user
router.get('/getOrderById/:id', validateAccessToken, getOrderById); // both

router.get('/admin/getAllOrders', validateAccessToken, authorizeRoles('admin'), getAllOrders); // admin

router.get('/admin/updateOrderStatus', validateAccessToken, updateOrderStatusByAdmin); // admin 
router.get('/admin/assignOrderCourierPatner', validateAccessToken, assignOrderCourierPatner); // admin 

export default router;