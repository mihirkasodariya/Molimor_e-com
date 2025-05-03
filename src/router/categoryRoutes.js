import { Router } from 'express';
const router = Router();
import { addCategory, getActiveCategoryList, getCategoryList, getCategoryById, updateCategory, inActiveCategory } from '../controller/categoryController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post("/admin/addCategory", validateAccessToken, authorizeRoles("admin"), addCategory); // admin
router.get("/admin/getActiveCategoryList", validateAccessToken, authorizeRoles("admin"), getActiveCategoryList); // admin
router.get("/getCategoryList", validateAccessToken, getCategoryList); // user
router.get("/getCategoryById/:id", validateAccessToken, getCategoryById); // both
router.put("/admin/updateCategory/:id", validateAccessToken, authorizeRoles("admin"), updateCategory); // admin
router.put("/admin/inActiveCategory/:id", validateAccessToken, authorizeRoles("admin"), inActiveCategory); // admin

export default router;
