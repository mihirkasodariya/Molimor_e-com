const express = require("express");
const router = express.Router();
const contactController = require('../controller/contactUsController'); 
const {validateAccessToken, authorizeRoles} = require("../middeleware/auth")

router.post("/addContactUs", validateAccessToken, authorizeRoles('admin'), contactController.addContactUs); 
router.get("/getContactUs", contactController.getAllCustomerQuerysList);


router.post("/admin/addCompanyinfo", validateAccessToken, authorizeRoles('admin'), contactController.addCompanyinfo); // admin
router.get("/getCompanyinfo", validateAccessToken, contactController.getCompanyinfo); // user


module.exports = router;
