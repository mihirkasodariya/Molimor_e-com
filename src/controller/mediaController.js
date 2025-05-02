const { mediaModel, mediaValidation, videoValidation, mediaIdValidation, mediaActiveValidation, socialAccountModel, socialAccountValidation } = require('../model/mediaModel');

const response = require('../utils/response');

module.exports.addMedia = async (req, res) => {
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
                    return response.error(res, 400, error.details[0].message);
                };
                return mediaModel.create({
                    file: file.filename,
                    type: 'img'
                });
            }),
        );

        return response.success(res, 200, 'Media uploaded successfully', savedMedia);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.adminGetAllMedia = async (req, res) => {
    const { type } = req.params;
    try {
        const media = await mediaModel.find({ type: type, isDelete: false }).sort({ createdAt: -1 });

        if (!media.length) {
            return response.success(res, 200, 'No Media found', []);
        };

        return response.success(res, 200, 'Media retrieved successfully', media);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.getAllMedia = async (req, res) => {
    const { type } = req.params;
    try {
        const media = await mediaModel.find({ type: type, isActive: true, isDelete: false }).sort({ createdAt: -1 });

        if (!media.length) {
            return response.success(res, 200, 'No Media found', []);
        };

        return response.success(res, 200, 'Media retrieved successfully', media);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.addVideoUrl = async (req, res) => {
    const { vdoUrl } = req.body;
    const { error } = videoValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        mediaModel.create({
            file: vdoUrl,
            type: 'vdo'
        });
        return response.success(res, 200, 'Video URL added successfully', { vdoUrl });
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.deleteMediaById = async (req, res) => {
    const id = req.params.id;
    const { error } = mediaIdValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const deleteMediaById = await mediaModel.findByIdAndUpdate(id, { isDelete: true, isActive: false }, { new: true });
        return response.success(res, 200, 'Media deleted successfully', deleteMediaById);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.inActiveMediaById = async (req, res) => {
    const id = req.params.id;
    const isActive = req.body.isActive;
    req.body.id = id;
    let { error } = mediaActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const inActiveMedia = await mediaModel.findByIdAndUpdate(id, { isActive }, { new: true });
        return response.success(res, 200, 'Media inactivated successfully', inActiveMedia);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};



exports.addSocialAccountURL = async (req, res) => {
    const {facebook, instagram, linkedin, twitter} = req.body;
    const { error } = socialAccountValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const existingLink = await socialAccountModel.findOne().lean();

        let result;
        if (!existingLink) {
            result = await socialAccountModel.create(req.body);
            return response.success(res, 200, "Social links created successfully.", result);
        } else {
            result = await socialAccountModel.findOneAndUpdate({}, req.body, {
                new: true,
                upsert: true,
            });
            return response.success(res, 200, "Social links updated successfully.", result);
        };
    } catch (err) {
        console.error("Error adding/updating social account:", err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};



exports.getSocialAccountURL = async (req, res) => {
    try {
        const link = await socialAccountModel.findOne().lean();
        if (!link) {
            return response.success(res, 200, "No social links found.", {});
        };
        return response.success(res, 200, "Social links retrieved successfully.", link);
    } catch (err) {
        console.error("Error fetching social links:", err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};
