import { Router } from 'express';
const router = Router();
import { addCategory, getActiveCategoryList, getCategoryList, getCategoryById, updateCategory, inActiveCategory } from '../controller/categoryController.js';
import auth from "../middeleware/auth.js";
import { categoryImage } from '../utils/multerStorage.js';
const { validateAccessToken, authorizeRoles } = auth;

router.post("/admin/addCategory", categoryImage.single('image'), validateAccessToken, authorizeRoles("admin"), addCategory); // admin
router.get("/admin/getActiveCategoryList", validateAccessToken, authorizeRoles("admin"), getActiveCategoryList); // admin
router.get("/getCategoryList", getCategoryList); // user
router.get("/getCategoryById/:id", getCategoryById); // both
router.put("/admin/updateCategory/:id", validateAccessToken, authorizeRoles("admin"), updateCategory); // admin
router.put("/admin/inActiveCategory/:id", validateAccessToken, authorizeRoles("admin"), inActiveCategory); // admin

export default router;