import model from "../model/categoryModel.js";
const { categoryModel, categoryValidation, categoryIdValidation, categoryInActiveValidation } = model;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addCategory(req, res) {
    try {
        const { name } = req.body;
        const image = req?.file?.filename || '';
        req.body.image = image;
        const { error } = categoryValidation.validate(req.body);
        if (error) {
            return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
        };
        const lastCategory = await categoryModel.findOne().sort({ categoryId: -1 });
        const newCategoryId = typeof lastCategory?.categoryId === 'number' ? lastCategory.categoryId + 1 : 101;

        const newCategory = new categoryModel({
            name,
            image,
            categoryId: newCategoryId
        });
        await newCategory.save();
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_ADDED, newCategory);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getActiveCategoryList(req, res) {
    try {
        const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });

        const updatedCategories = categories.map(category => ({
            ...category._doc,
            image: `/category/${category.image}`
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORIES_FETCHED, updatedCategories);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


export async function getCategoryList(req, res) {
    try {
        const categories = await categoryModel.find({}).sort({ createdAt: -1 });
        const updatedCategories = categories.map(category => ({
            ...category._doc,
            image: `/category/${category.image}`
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORIES_FETCHED, updatedCategories);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getCategoryById(req, res) {
    try {
        const { error } = categoryIdValidation.validate(req.params);
        if (error) {
            return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
        };
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.CATEGORY_NOT_FOUND, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORIES_FETCHED, category);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateCategory(req, res) {
    const { error } = categoryIdValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    console.log(error)
    try {
        const updateCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updateCategory) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.CATEGORY_NOT_FOUND, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_UPDATED, updateCategory);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveCategory(req, res) {
    const { isActive } = req.body;
    const { error } = categoryInActiveValidation.validate(req.params, req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const inActiveCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { isActive: isActive },
            { new: true }
        );
        if (!inActiveCategory) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.CATEGORY_NOT_FOUND, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORY_INACTIVATED, inActiveCategory);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};
