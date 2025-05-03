import { Router } from 'express';
const router = Router();
import { addToCart, getUserCart, updateCartByProductId, deleteCartByProductId } from '../controller/cartController.js';
import auth from "../middeleware/auth.js";
const { validateAccessToken, authorizeRoles } = auth;

router.post('/addToCart', validateAccessToken, addToCart); // user
router.get('/getUserCart', validateAccessToken, getUserCart); // user
router.put('/updateCartByProductId/:productId', validateAccessToken, updateCartByProductId); // user
router.delete('/deleteCartByProductId/:productId', validateAccessToken, deleteCartByProductId); // user

export default router;