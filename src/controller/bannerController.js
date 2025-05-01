const { bannerModel, bannerValidation, bannerIdValidation, bannerActiveValidation } = require('../model/bannerModel');
const response = require('../utils/response');

module.exports.addBanner = async (req, res) => {
    const { error } = bannerValidation.validate({image : req?.file?.filename});
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const addbanner = await bannerModel.create({
            image: req?.file.filename,
        });
        return response.success(res, 200, 'Banner added successfully', addbanner);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.getAllBanner = async (req, res) => {
    try {
        const bannerList = await bannerModel.find({ isActive: true, isDelete: false }).sort({ createdAt: -1 });
        if (!bannerList) {
            return response.error(res, 403, 'Banner List is empty', []);
        };
        const updatedBannerList = bannerList.map(banner => {
            return {
                ...banner._doc,
                image: banner.image.startsWith("/banner/")
                    ? banner.image
                    : `/banner/${banner.image}`
            };
        });
        return response.success(res, 200, 'Banner List fetched successfully', updatedBannerList);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.adminGetAllBanner = async (req, res) => {
    try {
        const bannerList = await bannerModel.find({isDelete: false }).sort({ createdAt: -1 });
        if (!bannerList) {
            return response.error(res, 403, 'Banner List is empty', []);
        };
        const updatedBannerList = bannerList.map(banner => {
            return {
                ...banner._doc,
                image: banner.image.startsWith("/banner/")
                    ? banner.image
                    : `/banner/${banner.image}`
            };
        });
        return response.success(res, 200, 'Banner List fetched successfully', updatedBannerList);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.deleteBannerById = async (req, res) => {
    const bannerId = req.params.id;
    const { error } = bannerIdValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const deleteBanner = await bannerModel.findByIdAndUpdate(bannerId, { isDelete: true, isActive: false }, { new: true });

        return response.success(res, 200, 'Banner deleted successfully', deleteBanner);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.inActiveBannerById = async (req, res) => {
    const bannerId = req.params.id;
    const isActive = req.body.isActive;
    req.body.id = bannerId;
    let { error } = bannerActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const inActiveBanner = await bannerModel.findByIdAndUpdate(bannerId, { isActive }, { new: true });
        return response.success(res, 200, 'Banner inactivated successfully', inActiveBanner);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};
