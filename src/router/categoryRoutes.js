const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { validateAccessToken, authorizeRoles } = require("../middeleware/auth");

router.post("/admin/addCategory", validateAccessToken, authorizeRoles("admin"), categoryController.addCategory);
router.get("/getCategoryList", validateAccessToken, authorizeRoles("admin"), categoryController.getCategoryList);
router.get("/getCategoryById/:id", validateAccessToken, authorizeRoles("admin"), categoryController.getCategoryById);
router.put("/admin/updateCategory/:id", validateAccessToken, authorizeRoles("admin"), categoryController.updateCategory);
router.put("/admin/inActiveCategory/:id", validateAccessToken, authorizeRoles("admin"), categoryController.inActiveCategory);

module.exports = router;
