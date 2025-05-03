import model from "../model/subCategoryModel.js";
const { subCategoryModel, subCategoryValidation, subCategoryIdValidation, inActiveSubCategoryValidation } = model;
import subModel from "../model/categoryModel.js";
const { categoryModel } = subModel;
import response from '../utils/response.js';

export async function addSubCategory(req, res) {
    const { name, categoryId } = req.body;

    const { error } = subCategoryValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const matchedName = await categoryModel.findById(categoryId);
        if (!matchedName) {
            return response.error(res, 403, 'Category not found', {});
        };
        const newSubcategory = new subCategoryModel({ name, categoryId });
        await newSubcategory.save();
        return response.success(res, 200, 'Subcategory added successfully', newSubcategory);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getSubCategoryList(req, res) {
    try {
        const categories = await subCategoryModel.find({}).sort({ createdAt: -1 });
        return response.success(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getActiveSubCategoryList(req, res) {
    try {
        const categories = await subCategoryModel.find({ isActive: true }).populate("categoryId").sort({ createdAt: -1 });
        return response.success(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getSubCategoryById(req, res) {
    const { error } = subCategoryIdValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const subcategory = await subCategoryModel.findById(req.params.id).populate("categoryId", "name");
        if (!subcategory) {
            return response.error(res, 403, 'Sub Category not found', {});
        };
        return response.success(res, 200, 'Subcategory fetched successfully', subcategory);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function updateSubCategory(req, res) {
    const { name, categoryId } = req.body;
    const { error } = subCategoryValidation.validate(req.body, req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const updateSubCategory = await subCategoryModel.findByIdAndUpdate(
            req.params.id,
            { name, categoryId },
            { new: true }
        );
        if (!updateSubCategory) {
            return response.error(res, 403, 'Sub Category not found', {});
        }
        return response.success(res, 200, 'Sub Category added successfully', updateSubCategory);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function inActiveSubcategory(req, res) {
    const { isActive } = req.body;
    const { id } = req.params;

    const { error } = inActiveSubCategoryValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const inActiveSubcategory = await subCategoryModel.findByIdAndUpdate(
            id,
            { isActive: isActive },
            { new: true }
        );
        if (!inActiveSubcategory) {
            return response.error(res, 403, 'Sub Category not found', {});
        };
        return response.success(res, 200, 'Subcategory InActive successfully', inActiveSubcategory);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}