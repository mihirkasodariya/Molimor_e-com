const express = require("express");
const router = express.Router();
const aboutController = require('../controller/aboutController'); 
const {validateAccessToken, authorizeRoles} = require("../middeleware/auth")


router.post("/addAbout", validateAccessToken, authorizeRoles('admin'), aboutController.addAbout);
router.get("/getAbout", authorizeRoles, aboutController.getAbout);


module.exports = router;
