import model from '../model/couponModel.js';
const { couponModel, couponValidation, couponIdValidation } = model
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;
import mongoose from 'mongoose';

export async function addCoupon(req, res) {
    const { code, description, discountType, discountValue, minPurchase, maxPurchase, validFrom, validTo, } = req.body;
    const { error } = couponValidation.validate(req.body);

    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const existingCoupon = await couponModel.findOne({ code });

        if (existingCoupon) {
            return response.error(res, req.languageCode, resStatusCode.CONFLICT, resMessage.COUPON_CODE_EXISTS, {});
        };
        const newCoupon = new couponModel({ ...req.body });
        await newCoupon.save();

        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COUPON_CREATED, newCoupon);
    } catch (err) {
        console.error('Coupon creation failed:', err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getCouponById(req, res) {
    const { error } = couponIdValidation.validate({ ...req.params });

    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const coupon = await couponModel.findById({ _id: req.params.id });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COUPON_FETCHED, coupon);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllCouponList(req, res) {
    try {
        const coupon = await couponModel.find({ isActive: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COUPON_FETCHED, coupon);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateCouponById(req, res) {
    const { description, discountType, discountValue, minPurchase, maxPurchase, validFrom, validTo } = req.body;
    let id = req.params.id;
    const { error } = couponIdValidation.validate({ id });
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const updatedCoupon = await couponModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedCoupon) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.COUPON_NOT_FOUND, {});
        };
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COUPON_UPDATED, updatedCoupon);
    } catch (err) {
        console.error('Coupon update failed:', err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteCouponById(req, res) {
    let id = req.params.id;
    const { error } = couponIdValidation.validate({ id });
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const deleteCoupon = await couponModel.findByIdAndUpdate(
            id,
            { $set: { isActive: false } },
            { new: true }
        );
        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.COUPON_DELETED, deleteCoupon);
    } catch (err) {
        console.error('Coupon update failed:', err);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function validateCoupon(req, res) {
    const { code, item } = req.body;
    const currentDate = new Date();

    try {
        const validationResults = await Promise.all(item.map(async ({ productId, price }) => {
            let isCoupon = false;

            let productCoupon = null;

            if (productId) {
                productCoupon = await couponModel.findOne({
                    code: code,
                    isActive: true,
                    productId: new mongoose.Types.ObjectId(productId), 
                    validFrom: { $lte: currentDate },
                    validTo: { $gte: currentDate },
                });
            }

            const priceCoupon = await couponModel.findOne({
                code: code,
                isActive: true,
                validFrom: { $lte: currentDate },
                validTo: { $gte: currentDate },
                minPurchase: { $lte: price },
                $or: [{ maxPurchase: { $gte: price } }, { maxPurchase: { $exists: false } }],
            });

            if (productCoupon || priceCoupon) {
                isCoupon = true;
            }

            return {
                productId,
                price,
                isCoupon,
                ...priceCoupon?._doc,
                ...productCoupon?._doc
            };
        }));

        return response.success(
            res,
            req.languageCode,
            resStatusCode.ACTION_COMPLETE,
            resMessage.COUPON_VALID,
            validationResults
        );
    } catch (err) {
        console.error('Coupon validation failed:', err);
        return response.error(
            res,
            req.languageCode,
            resStatusCode.INTERNAL_SERVER_ERROR,
            resMessage.INTERNAL_SERVER_ERROR,
            {}
        );
    }
}

