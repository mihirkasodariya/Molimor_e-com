import { Router } from "express";
const router = Router();
import { addContactUs, getAllCustomerQuerysList, addCompanyinfo, getCompanyinfo } from '../controller/contactUsController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post("/addContactUs", validateAccessToken, addContactUs);
router.get("/admin/getContactUs", validateAccessToken, authorizeRoles('admin'), getAllCustomerQuerysList);


router.post("/admin/addCompanyinfo", validateAccessToken, authorizeRoles('admin'), addCompanyinfo); // admin
router.get("/getCompanyinfo", getCompanyinfo); // user


export default router;
