import { Router } from 'express';
const router = Router();
import { addWishlist, getWishlist, removeFromWishlist } from '../controller/wishlistController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken } = auth;

router.post('/addWishlist', validateAccessToken, addWishlist); // user
router.get('/getWishlist', validateAccessToken, getWishlist); // user
router.delete('/removeFromWishlist/:productId', validateAccessToken, removeFromWishlist); // user

export default router;