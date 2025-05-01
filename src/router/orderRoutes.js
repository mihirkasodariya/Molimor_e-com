const express = require('express');
const router = express.Router();
const orderController = require('../controller/orderController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth")

router.post('/placeOrder', validateAccessToken, orderController.placeOrder); // user
router.get('/getAllUserOrders', validateAccessToken, orderController.getAllUserOrders); // user
router.get('/getOrderById/:id', validateAccessToken, orderController.getOrderById); // both

router.get('/admin/getAllOrders', validateAccessToken, authorizeRoles('admin'), orderController.getAllOrders); // admin

router.get('/admin/updateOrderStatus', validateAccessToken, orderController.updateOrderStatusByAdmin); // admin 
router.get('/admin/assignOrderCourierPatner', validateAccessToken, orderController.assignOrderCourierPatner); // admin 

module.exports = router;