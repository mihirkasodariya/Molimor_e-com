import { Router } from 'express';
const router = Router();
import { addReview, inActiveReview, getAllReviewByProductId, adminGetAllReviewByProductId } from '../controller/reviewController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post('/addReview', validateAccessToken, addReview); // user
router.delete('/admin/inActiveReview/:id', validateAccessToken, authorizeRoles('admin'), inActiveReview); // admin
router.get('/getAllReviewByProductId/:id', getAllReviewByProductId); // admin
router.get('/admin/getAllReviewByProductId/:id', validateAccessToken, adminGetAllReviewByProductId); // admin

export default router;