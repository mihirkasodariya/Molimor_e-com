import model from '../model/bannerModel.js';
const { bannerModel, bannerValidation, bannerIdValidation, bannerActiveValidation, shopBannerModel, shopBannerValidation } = model;
import productMdl from '../model/productModel.js';
const { productModel } = productMdl;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addBanner(req, res) {
    const productId = req.params?.id
    const { error } = bannerValidation.validate({ image: req?.file?.filename });
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const addbanner = await bannerModel.create({
            image: req?.file.filename,
            productId: productId
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_ADDED, addbanner);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllBanner(req, res) {
    try {
        const bannerList = await bannerModel.find({ isActive: true, isDelete: false }).sort({ createdAt: -1 });

        if (!bannerList.length) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.BANNER_LIST_EMPTY, []);
        };

        // const productList = await productModel.find({ isActive: true, isDelete: false });

        const updatedBannerList = await Promise.all(
            bannerList.map(async (banner) => {
                const formattedImage = banner.image.startsWith("/banner/")
                    ? banner.image
                    : `/banner/${banner.image}`;

                // if (!banner.productId) {
                //     const productIds = productList.map(product => product._id);
                //     return {
                //         ...banner._doc,
                //         productId: productIds,
                //         image: formattedImage,
                //     };
                // };
                return { ...banner._doc, image: formattedImage, };
            })
        );

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_LIST_FETCHED, updatedBannerList);
    } catch (err) {
        console.error("Error in getAllBanner:", err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
}


export async function adminGetAllBanner(req, res) {
    try {
        const bannerList = await bannerModel.find({ isDelete: false }).sort({ createdAt: -1 });
        if (!bannerList) {
            return response.error(res, resStatusCode.FORBIDDEN, resMessage.BANNER_LIST_EMPTY, []);
        };
        const updatedBannerList = bannerList.map(banner => {
            return {
                ...banner._doc,
                image: banner.image.startsWith("/banner/")
                    ? banner.image
                    : `/banner/${banner.image}`
            };
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_LIST_FETCHED, updatedBannerList);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteBannerById(req, res) {
    const bannerId = req.params.id;
    const { error } = bannerIdValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const deleteBanner = await bannerModel.findByIdAndUpdate(bannerId, { isDelete: true, isActive: false }, { new: true });

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_DELETED, deleteBanner);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveBannerById(req, res) {
    const bannerId = req.params.id;
    const isActive = req.body.isActive;
    req.body.id = bannerId;
    let { error } = bannerActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const inActiveBanner = await bannerModel.findByIdAndUpdate(bannerId, { isActive }, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_INACTIVATED, inActiveBanner);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function addBannerForShopNow(req, res) {
    try {
        const productId = req.params?.id;
        const image = req?.file?.filename;
        console.log('productId', productId)
        const { error } = shopBannerValidation.validate({ image, productId });
        if (error) {
            return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
        };
        
        const addBannerForShopNow = await shopBannerModel.create({
            image,
            productId,
        });
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_ADDED, addBannerForShopNow);
    } catch (err) {
        console.error('Error in addBannerForShopNow:', err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllBannerForShopNow(req, res) {
    try {
        const getAllBannerForShopNow = await shopBannerModel.find({ isActive: true, isDelete: false }).populate('productId');
        const updatedBannerList = getAllBannerForShopNow.map(banner => {
            return {
                ...banner._doc,
                image: banner.image.startsWith("/banner/")
                    ? banner.image
                    : `/banner/${banner.image}`
            };
        });
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_LIST_FETCHED, updatedBannerList);
    } catch (err) {
        console.error('Error in addBannerForShopNow:', err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteShopNowBannerById(req, res) {
    const bannerId = req.params.id;
    const { error } = bannerIdValidation.validate(req.params);

    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const deleteBanner = await shopBannerModel.findByIdAndUpdate(bannerId, { isDelete: true, isActive: false }, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.BANNER_DELETED, deleteBanner);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};