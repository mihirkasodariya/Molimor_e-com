import model from '../model/wishlistModel.js';
const { wishlistModel, wishlistActionValidation } = model;
import response from '../utils/response.js';

export async function addWishlist(req, res) {
    const { productId } = req.body;
    const userId = req.user.id;

    const { error } = wishlistActionValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
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
        return response.success(res, 200, 'Product added to wishlist', wishlist);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getWishlist(req, res) {
    const userId = req.user.id;
    try {
        const wishlist = await wishlistModel.findOne({ userId }).populate('items.productId');
        if (!wishlist) {
            return response.error(res, 403, 'Wishlist is empty', []);
        };
        return response.success(res, 200, 'Wishlist fetched successfully', wishlist.items);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function removeFromWishlist(req, res) {
    const { productId } = req.params;
    const userId = req.user.id;
    const { error } = wishlistActionValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const wishlist = await wishlistModel.findOne({ userId });

        if (!wishlist) {
            return response.error(res, 404, "Wishlist not found");
        };
        const item = wishlist.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return response.error(res, 404, "Product not found in wishlist");
        };
        item.isDelete = true;
        await wishlist.save();
        return response.success(res, 200, 'Product marked as deleted from wishlist', wishlist);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}
