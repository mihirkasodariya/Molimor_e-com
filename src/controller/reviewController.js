import model from '../model/reviewModel.js';
const { reviewModel, reviewValidation, inActiveValidation } = model;
import response from '../utils/response.js';

export async function addReview(req, res) {
    const { rating, productId, name, email, comment } = req.body;
    const userId = req.user.id;

    const { error } = reviewValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        let existsReview = await reviewModel.findOne({ productId, userId });

        if (existsReview) {
            return response.error(res, 403, 'You have already submitted a review for this product.');
        };
        const addReview = await reviewModel.create({
            rating,
            userId,
            productId,
            name,
            email,
            comment
        });
        return response.success(res, 200, 'Thank you! Your review has been submitted successfully.', addReview);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function inActiveReview(req, res) {
    const { productId, isActive } = req.body;
    const userId = req.params.id

    const { error } = inActiveValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const updatedReview = await reviewModel.findOneAndUpdate(
            { productId, userId },
            { isActive },
            { new: true }
        );
        return response.success(res, 200, 'Your review has been updated successfully.', updatedReview);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Oops! Something went wrong while updating your review.', {});
    };
}