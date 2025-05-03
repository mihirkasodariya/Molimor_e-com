import model from '../model/cartModel.js';
const { cartModel, cartValidation, updateCartValidation } = model;
import response from '../utils/response.js';

export async function addToCart(req, res) {
    const { items, isActive } = req.body;
    const { error } = cartValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        let existingCart = await cartModel.findOne({ userId: req.user.id });
        if (existingCart) {
            items.forEach(newItem => {
                const existingItem = existingCart.items.find(
                    item => item.productId.toString() === newItem.productId
                );

                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                    existingItem.isDelete = false;
                } else {
                    existingCart.items.push(newItem);
                };
            });

            existingCart.isActive = isActive ?? existingCart.isActive;
            await existingCart.save();
            return response.success(res, 200, 'Cart updated successfully', existingCart);
        } else {
            const newCart = await cartModel.create({ userId: req.user.id, items, isActive });
            return response.success(res, 201, 'Cart created successfully', newCart);
        };
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getUserCart(req, res) {
    try {
        const getUserCart = await cartModel.findOne({ userId: req.user.id }).populate("items.productId");;

        const item = getUserCart?.items.filter(item => item.isDelete === false);
        if (!item || item?.length === 0) {
            return response.error(res, 404, 'No Cart Found.', {});
        };

        return response.success(res, 200, 'Cart fetched successfully', item);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function updateCartByProductId(req, res) {
    const { productId } = req.params;
    const { quantity } = req.body;
    const { error } = updateCartValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const cart = await cartModel.findOne({ userId: req.user.id });
        if (!cart) {
            return response.error(res, 403, 'Cart not found', {});
        };

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return response.error(res, 403, 'Product not found in cart', {});
        };
        if (quantity <= 0) {
            item.isDelete = true;
            item.quantity = 0;
        } else {
            item.quantity = quantity;
            item.isDelete = false;
        };
        await cart.save();
        return response.success(res, 200, 'Cart item updated successfully', cart);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function deleteCartByProductId(req, res) {
    const { productId } = req.params;
    try {
        const userCart = await cartModel.findOne({ userId: req.user.id });

        if (!userCart) {
            return response.error(res, 403, 'Cart not found.');
        };

        const isProductInCart = userCart.items.find(item => item.productId == productId);

        if (!isProductInCart) {
            return response.error(res, 403, 'Product not found in cart.');
        };

        const updatedProduct = await cartModel.findOneAndUpdate(
            { userId: req.user.id, 'items.productId': productId },
            { $set: { 'items.$.isDelete': true } },
            { new: true }
        );
        return response.success(res, 200, 'Cart has been deleted successfully.', updatedProduct);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

