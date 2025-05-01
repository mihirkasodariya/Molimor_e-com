const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth");

router.post("/admin/addCategory", validateAccessToken, authorizeRoles("admin"), categoryController.addCategory); // admin
router.get("/admin/getActiveCategoryList", validateAccessToken, authorizeRoles("admin"), categoryController.getActiveCategoryList); // admin
router.get("/getCategoryList", validateAccessToken, categoryController.getCategoryList); // user
router.get("/getCategoryById/:id", validateAccessToken, categoryController.getCategoryById); // both
router.put("/admin/updateCategory/:id", validateAccessToken, authorizeRoles("admin"), categoryController.updateCategory); // admin
router.put("/admin/inActiveCategory/:id", validateAccessToken, authorizeRoles("admin"), categoryController.inActiveCategory); // admin

module.exports = router;
