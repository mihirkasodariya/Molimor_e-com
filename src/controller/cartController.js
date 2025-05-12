import model from '../model/cartModel.js';
const { cartModel, cartValidation, updateCartValidation } = model;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addToCart(req, res) {
    const { items, isActive, weight } = req.body;
    const { error } = cartValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        let existingCart = await cartModel.findOne({ userId: req.user.id, isActive: true });
        if (existingCart) {
            items.forEach(newItem => {
                const existingItem = existingCart.items.find(
                    item => item.productId.toString() === newItem.productId
                );

                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                    existingItem.isDelete = false;
                    existingItem.weight = weight
                } else {
                    existingCart.items.push(newItem);
                };
            });

            existingCart.isActive = isActive ?? existingCart.isActive;
            await existingCart.save();
            return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CART_UPDATED, existingCart);
        } else {
            const newCart = await cartModel.create({ userId: req.user.id, items, isActive });
            return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CART_CREATED, newCart);
        };
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getUserCart(req, res) {
    try {
        const getUserCart = await cartModel.findOne({ userId: req.user.id }).populate("items.productId");;
        const items = getUserCart?.items.filter(item => item.isDelete === false);

        const item = getUserCart?.items.filter(item => item.isDelete === false);
        if (!item || item?.length === 0) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_CART_FOUND, {});
        };
        const updatedItems = items.map(item => {
            const product = item.productId;

            if (product?.image?.length) {
                product.image = product?.image.map(img => `/productImages/${img}`);
            };

            return item;
        });
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CART_FETCHED, updatedItems);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateCartByProductId(req, res) {
    const { productId } = req.params;
    const { quantity, weight } = req.body;
    const { error } = updateCartValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const cart = await cartModel.findOne({ userId: req.user.id, isActive: true });
        if (!cart) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessageNO_CART_FOUND, {});
        };

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.PRODUCT_NOT_IN_CART, {});
        };
        if (quantity <= 0) {
            item.isDelete = true;
            item.quantity = 0;
        } else {
            item.quantity = quantity;
            item.isDelete = false;
            item.weight = weight;
        };
        await cart.save();
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CART_ITEM_UPDATED, cart);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteCartByProductId(req, res) {
    const { productId } = req.params;
    try {
        const updatedCart = await cartModel.updateOne(
            { userId: req.user.id },
            { $pull: { items: { productId } } }
        );
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CART_DELETED, updatedCart);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
};


