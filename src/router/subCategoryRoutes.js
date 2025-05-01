const express = require('express');
const router = express.Router();
const subCategoryController = require('../controller/subCategoryController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth");

router.post("/admin/addSubCategory", validateAccessToken, authorizeRoles("admin"), subCategoryController.addSubCategory); // admin
router.get("/getSubCategoryList", validateAccessToken, authorizeRoles("admin"), subCategoryController.getSubCategoryList); // admin
router.get("/getSubCategoryById/:id", validateAccessToken, subCategoryController.getSubCategoryById); // both
router.put("/admin/updateSubCategory/:id", validateAccessToken, authorizeRoles("admin"), subCategoryController.updateSubCategory); // admin
router.put("/admin/inActiveSubcategory/:id", validateAccessToken, authorizeRoles("admin"), subCategoryController.inActiveSubcategory); // admin

router.get("/getActiveSubCategoryList", validateAccessToken, subCategoryController.getActiveSubCategoryList); // user

module.exports = router;
