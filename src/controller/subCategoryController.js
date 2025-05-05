import model from "../model/subCategoryModel.js";
const { subCategoryModel, subCategoryValidation, subCategoryIdValidation, inActiveSubCategoryValidation } = model;
import subModel from "../model/categoryModel.js";
const { categoryModel } = subModel;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;

export async function addSubCategory(req, res) {
    const { name, categoryId } = req.body;

    const { error } = subCategoryValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const matchedName = await categoryModel.findById(categoryId);
        if (!matchedName) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.CATEGORY_NOT_FOUND, {});
        };
        const newSubcategory = new subCategoryModel({ name, categoryId });
        await newSubcategory.save();
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.SUBCATEGORY_ADDED, newSubcategory);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getSubCategoryList(req, res) {
    try {
        const categories = await subCategoryModel.find({}).sort({ createdAt: -1 });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORIES_FETCHED, categories);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getActiveSubCategoryList(req, res) {
    try {
        const categories = await subCategoryModel.find({ isActive: true }).populate("categoryId").sort({ createdAt: -1 });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.CATEGORIES_FETCHED, categories);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getSubCategoryById(req, res) {
    const { error } = subCategoryIdValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const subcategory = await subCategoryModel.findById(req.params.id).populate("categoryId", "name");
        if (!subcategory) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.SUBCATEGORY_NOT_FOUND, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.SUBCATEGORY_FETCHED, subcategory);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateSubCategory(req, res) {
    const { name, categoryId } = req.body;
    const { error } = subCategoryValidation.validate(req.body, req.params);
    if (error) {
        return response.error(res, req?.languageCode, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const updateSubCategory = await subCategoryModel.findByIdAndUpdate(
            req.params.id,
            { name, categoryId },
            { new: true }
        );
        if (!updateSubCategory) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.SUBCATEGORY_NOT_FOUND, {});
        }
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.SUBCATEGORY_UPDATED, updateSubCategory);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveSubcategory(req, res) {
    const { isActive } = req.body;
    const { id } = req.params;

    const { error } = inActiveSubCategoryValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const inActiveSubcategory = await subCategoryModel.findByIdAndUpdate(
            id,
            { isActive: isActive },
            { new: true }
        );
        if (!inActiveSubcategory) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.SUBCATEGORY_NOT_FOUND, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.SUBCATEGORY_INACTIVE, inActiveSubcategory);
    } catch (error) {
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};