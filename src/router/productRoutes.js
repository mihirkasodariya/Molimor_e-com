import { Router } from 'express';
const router = Router();
import { addSingleProduct, getAllProductsList, getAllAdminProductsList, getProductById, updateSingleProduct, deleteProductById, inActiveProductById, searchProduct, downloadAddBulkProductTemplate, uploadBulkProductsFile } from '../controller/productController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import { productImage, uploadExcelFile } from '../utils/multerStorage.js';

router.post('/admin/addSingleProduct', productImage.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), addSingleProduct); // admin
router.get('/getAllProductsList', getAllProductsList); // user
router.get('/admin/getAllProductsList', validateAccessToken, getAllAdminProductsList); // admin
router.get('/getProduct/:id', getProductById);  // both
router.put('/admin/updateProduct/:id', productImage.fields([{ name: 'image' }]), validateAccessToken, authorizeRoles("admin"), updateSingleProduct); // admin
router.delete('/admin/deleteProduct/:id', validateAccessToken, authorizeRoles("admin"), deleteProductById); // admin
router.put('/admin/inActiveProduct/:id', validateAccessToken, authorizeRoles("admin"), inActiveProductById); // admin


router.get('/searchProduct/:searchProduct', searchProduct); // user 
router.get('/downloadAddBulkProductTemplate', validateAccessToken, authorizeRoles("admin"), downloadAddBulkProductTemplate); // admin
router.get('/uploadBulkProductsFile', [uploadExcelFile.single('file'),], validateAccessToken, authorizeRoles("admin"), uploadBulkProductsFile); // admin

export default router;