import model from '../model/wishlistModel.js';
const { wishlistModel, wishlistActionValidation } = model;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addWishlist(req, res) {
    const { productId } = req.body;
    const userId = req.user.id;

    const { error } = wishlistActionValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        let wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            wishlist = await wishlistModel.create({
                userId,
                items: [{ productId, addedAt: new Date() }]
            });
        } else {
            const alreadyExists = wishlist.items.some(item => item.productId.toString() === productId);
            if (!alreadyExists) {
                wishlist.items.push({ productId, addedAt: new Date() });
                await wishlist.save();
            };
        };
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_ADDED_WISHLIST, wishlist);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getWishlist(req, res) {
    const userId = req.user.id;
    try {
        const wishlist = await wishlistModel.findOne({ userId }).populate('items.productId');
        if (!wishlist) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.DATA_NOT_FOUND, []);
        };
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.WISHLIST_FETCHED, wishlist.items);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function removeFromWishlist(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;
    const { error } = wishlistActionValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.DATA_NOT_FOUND, []);
        };
        const item = wishlist.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.PRODUCT_NOT_FOUND, {});
        };
        item.isDelete = true;
        await wishlist.save();
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_DELETED_WISHLIST, wishlist, {});
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};
