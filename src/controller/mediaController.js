import model from '../model/mediaModel.js';
const { mediaModel, mediaValidation, videoValidation, mediaIdValidation, mediaActiveValidation, socialAccountModel, socialAccountValidation, marketPlaceModel, marketPlaceValidation, instaShopModel } = model;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addMedia(req, res) {
    try {
        let image = [];

        if (req.files) {
            image = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        } else if (req.file) {
            image = [req.file];
        };

        const savedMedia = await Promise.all(
            image.map(async (file) => {
                const { error } = mediaValidation.validate({ image: [file?.filename] });
                if (error) {
                    return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
                };
                return mediaModel.create({
                    file: file.filename,
                    type: 'img'
                });
            }),
        );
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_UPLOADED, savedMedia);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function adminGetAllMedia(req, res) {
    const { type } = req.params;
    try {
        const media = await mediaModel.find({ type: type, isDelete: false }).sort({ createdAt: -1 });

        if (!media.length) {
            return response.success(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_MEDIA_FOUND, []);
        };

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_RETRIEVED, media);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllMedia(req, res) {
    const { type } = req.params;
    try {
        const media = await mediaModel.find({ type: type, isActive: true, isDelete: false }).sort({ createdAt: -1 });

        if (!media.length) {
            return response.success(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_MEDIA_FOUND, []);
        };
         const updatedMedia = media.map(item => ({
            ...item.toObject(),
            file: type === 'img' ? `/media/${item.file}` : item.file,
        }));

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_RETRIEVED, updatedMedia);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function addVideoUrl(req, res) {
    const { vdoUrl } = req.body;
    const { error } = videoValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        mediaModel.create({
            file: vdoUrl,
            type: 'vdo'
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.VIDEO_URL_ADDED, { vdoUrl });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteMediaById(req, res) {
    const id = req.params.id;
    const { error } = mediaIdValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const deleteMediaById = await mediaModel.findByIdAndUpdate(id, { isDelete: true, isActive: false }, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_DELETED, deleteMediaById);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveMediaById(req, res) {
    const id = req.params.id;
    const isActive = req.body.isActive;
    req.body.id = id;
    let { error } = mediaActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const inActiveMedia = await mediaModel.findByIdAndUpdate(id, { isActive }, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_INACTIVATED, inActiveMedia);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function addSocialAccountURL(req, res) {
    const { facebook, instagram, linkedin, twitter } = req.body;
    const { error } = socialAccountValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const existingLink = await socialAccountModel.findOne().lean();

        let result;
        if (!existingLink) {
            result = await socialAccountModel.create(req.body);
            return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, SOCIAL_LINKS_CREATED, result);
        } else {
            result = await socialAccountModel.findOneAndUpdate({}, req.body, {
                new: true,
                upsert: true,
            });
            return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.SOCIAL_LINKS_UPDATED, result);
        };
    } catch (err) {
        console.error("Error adding/updating social account:", err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getSocialAccountURL(req, res) {
    try {
        const link = await socialAccountModel.findOne().lean();
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.SOCIAL_LINKS_RETRIEVED, link);
    } catch (err) {
        console.error("Error fetching social links:", err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function addMarketPlace(req, res) {
    const { error } = marketPlaceValidation.validate({ image: req?.file?.filename, link: req.body.link });
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    console.log(req.body)
    try {
        const addOtherStore = await marketPlaceModel.create({
            image: req?.file.filename,
            link: req.body.link
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ADD_OTHER_STORE, addOtherStore);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getMarketPlace(req, res) {
    try {
        const bannerList = await marketPlaceModel.find({ isActive: true, isDelete: false }).sort({ createdAt: -1 });
        if (!bannerList) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.MARKET_PLACE_LIST_EMPTY, []);
        };
        const updatedBannerList = bannerList.map(banner => {
            return {
                ...banner._doc,
                image: banner.image.startsWith("/marketPlace/")
                    ? banner.image
                    : `/marketPlace/${banner.image}`
            };
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MARKET_PLACE_LIST_FETCHED, updatedBannerList);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function addInstaShop(req, res) {
    try {
        // const image = req.file;
        const url = req.body.url;
        console.log('req.file?.filename', req.file?.filename)
        const addInstaShop = await instaShopModel({
            image: req.file?.filename,
            url: url
        });
        await addInstaShop.save();

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_UPLOADED, addInstaShop);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllInstaShop(req, res) {
    try {
        const allInstaShops = await instaShopModel.find().sort({ createdAt: -1 });

        const basePath = "/instaShop/";

        const updatedInstaShops = allInstaShops.map((item) => ({
            ...item._doc,
            image: item.image ? `${basePath}${item.image}` : null
        }));

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.MEDIA_RETRIEVED, updatedInstaShops);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
}

