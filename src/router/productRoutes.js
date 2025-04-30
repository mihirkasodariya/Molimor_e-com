const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const {validateAccessToken, authorizeRoles} = require("../middeleware/auth")
const { productImage, uploadExcelFile } = require('../utils/commonFunctions')

router.post('/admin/addSingleProduct', productImage.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), productController.addSingleProduct);
router.get('/getAllProductsList', validateAccessToken, productController.getAllProductsList);
router.get('/getProduct/:id', validateAccessToken, productController.getProductById); // category show karavvani baki che
router.put('/admin/updateProduct/:id', productImage.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), productController.updateSingleProduct);
router.delete('/admin/deleteProduct/:id', validateAccessToken, authorizeRoles("admin"), productController.deleteProductById);
router.put('/admin/inActiveProduct/:id', validateAccessToken, authorizeRoles("admin"), productController.inActiveProductById);


router.get('/searchProduct/:searchProduct', validateAccessToken, productController.searchProduct);
router.get('/downloadAddBulkProductTemplate', validateAccessToken, productController.downloadAddBulkProductTemplate);
router.get('/uploadBulkProductsFile', [uploadExcelFile.single('file'),],validateAccessToken, productController.uploadBulkProductsFile);

module.exports = router;