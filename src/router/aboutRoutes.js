import { Router } from "express";
const router = Router();
import { addAbout, getAbout } from '../controller/aboutController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;
import {uploadAboutUsImages } from '../utils/multerStorage.js'
router.post("/addAbout", uploadAboutUsImages,  validateAccessToken, authorizeRoles('admin'), addAbout);
router.get("/getAbout", getAbout);


export default router;
