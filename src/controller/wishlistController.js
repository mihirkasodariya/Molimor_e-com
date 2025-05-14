import model from '../model/wishlistModel.js';
const { wishlistModel, wishlistActionValidation } = model;
import model1 from '../model/cartModel.js';
const { cartModel } = model1;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
// import cartModel from '../model/cartModel.js';
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
        const wishlist = await wishlistModel.findOne({ userId, isActive: true }).populate('items.productId');
        const cart = await cartModel.findOne({ userId, isActive: true });

        if (!wishlist) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.DATA_NOT_FOUND, []);
        };
        const filteredCartItems = cart?.items?.filter(item => item.isDelete === false) || [];

        const cartProductIds = filteredCartItems.map(item => item.productId.toString());

        const filteredWishlistItems = wishlist.items.filter(item => item.isDelete === false);

        const wishlistWithCartFlag = filteredWishlistItems.map(item => {
            const productId = item.productId?._id?.toString();
    const product = item.productId?.toObject?.();

            return {
                ...item.toObject(),
                productId: {
                    ...item.productId.toObject(),
                    isCart: cartProductIds.includes(productId),
                     image: product?.image?.[0]
                ? `/productImages/${product.image[0]}`
                : ""
                },
            };
        });
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.WISHLIST_FETCHED, wishlistWithCartFlag);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function removeFromWishlist(req, res) {
    const { productId } = req.params;
    const { error } = wishlistActionValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        await wishlistModel.updateOne(
            { userId: req.user.id },
            { $pull: { items: { productId } } }
        );
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_DELETED_WISHLIST, {});
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};
