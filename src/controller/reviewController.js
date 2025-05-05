import model from '../model/reviewModel.js';
const { reviewModel, reviewValidation, inActiveValidation } = model;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addReview(req, res) {
    const { rating, productId, name, email, comment } = req.body;
    const userId = req.user.id;

    const { error } = reviewValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        let existsReview = await reviewModel.findOne({ productId, userId });

        if (existsReview) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.REVIEW_ALREADY_SUBMITTED, {});
        };
        const addReview = await reviewModel.create({
            rating,
            userId,
            productId,
            name,
            email,
            comment
        });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.REVIEW_SUBMITTED, addReview);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveReview(req, res) {
    const { productId, isActive } = req.body;
    const userId = req.params.id

    const { error } = inActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const updatedReview = await reviewModel.findOneAndUpdate(
            { productId, userId },
            { isActive },
            { new: true }
        );
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.REVIEW_INACTIVATED, updatedReview);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};