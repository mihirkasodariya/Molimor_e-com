import { Router } from "express";
const router = Router();
import { addAbout, getAbout } from '../controller/aboutController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post("/addAbout", validateAccessToken, authorizeRoles('admin'), addAbout);
router.get("/getAbout", authorizeRoles, getAbout);


export default router;
