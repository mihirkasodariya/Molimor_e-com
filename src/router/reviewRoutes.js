import { Router } from 'express';
const router = Router();
import { addReview, inActiveReview } from '../controller/reviewController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post('/addReview', validateAccessToken, addReview); // user
router.delete('/admin/inActiveReview/:id', validateAccessToken, authorizeRoles('admin'), inActiveReview); // admin

export default router;