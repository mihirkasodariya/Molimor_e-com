const express = require('express');
const router = express.Router();
const subCategoryController = require('../controller/subCategoryController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth");

router.post("/admin/addSubCategory", validateAccessToken, authorizeRoles("admin"), subCategoryController.addSubCategory);
router.get("/getSubCategoryList", validateAccessToken, authorizeRoles("admin"), subCategoryController.getSubCategoryList);
router.get("/getSubCategoryById/:id", validateAccessToken, authorizeRoles("admin"), subCategoryController.getSubCategoryById);
router.put("/admin/updateSubCategory/:id", validateAccessToken, authorizeRoles("admin"), subCategoryController.updateSubCategory);
router.put("/admin/inActiveSubcategory/:id", validateAccessToken, authorizeRoles("admin"), subCategoryController.inActiveSubcategory);

module.exports = router;
