const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const {validateAccessToken, authorizeRoles} = require("../middeleware/auth")
const { productImage, uploadExcelFile } = require('../utils/commonFunctions')

router.post('/admin/addSingleProduct', productImage.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), productController.addSingleProduct); // admin
router.get('/getAllProductsList', validateAccessToken, productController.getAllProductsList); // user
router.get('/admin/getAllProductsList', validateAccessToken, productController.getAllAdminProductsList); // admin
router.get('/getProduct/:id', validateAccessToken, productController.getProductById);  // both
router.put('/admin/updateProduct/:id', productImage.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), productController.updateSingleProduct); // admin
router.delete('/admin/deleteProduct/:id', validateAccessToken, authorizeRoles("admin"), productController.deleteProductById); // admin
router.put('/admin/inActiveProduct/:id', validateAccessToken, authorizeRoles("admin"), productController.inActiveProductById); // admin


router.get('/searchProduct/:searchProduct', validateAccessToken, productController.searchProduct); // user 
router.get('/downloadAddBulkProductTemplate', validateAccessToken, authorizeRoles("admin"), productController.downloadAddBulkProductTemplate); // admin
router.get('/uploadBulkProductsFile', [uploadExcelFile.single('file'),],validateAccessToken, authorizeRoles("admin"), productController.uploadBulkProductsFile); // admin

module.exports = router;