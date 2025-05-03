import model from "../model/categoryModel.js";
const { categoryModel, categoryValidation, categoryIdValidation, categoryInActiveValidation } = model;
import response from '../utils/response.js';

export async function addCategory(req, res) {
    const { name } = req.body;
    const { error } = categoryValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const newCategory = new categoryModel({ name });
        await newCategory.save();
        return response.success(res, 200, 'Category added successfully', newCategory);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getActiveCategoryList(req, res) {
    try {
        const categories = await categoryModel.find({ isActive: true }).sort({ createdAt: -1 });
        return response.success(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getCategoryList(req, res) {
    try {
        const categories = await categoryModel.find({}).sort({ createdAt: -1 });
        return response.success(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function getCategoryById(req, res) {
    try {
        const { error } = categoryIdValidation.validate(req.params);
        if (error) {
            return response.error(res, 400, error.details[0].message);
        };
        const category = await categoryModel.findById(req.params.id);
        if (!category) {
            return response.error(res, 403, 'Category not found', {});
        };
        return response.success(res, 200, 'Category fetched successfully', category);

    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
}

export async function updateCategory(req, res) {
    const { error } = categoryIdValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    console.log(error)
    try {
        const updateCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        console.log('updated', updateCategory)
        if (!updateCategory) {
            return response.error(res, 403, 'Category not found', {});
        };
        return response.success(res, 200, 'Category updated successfully', updateCategory);
    } catch (error) {
        res.status(500).json({ message: "Error updating category", error });
    };
}

export async function inActiveCategory(req, res) {
    const { isActive } = req.body;
    const { error } = categoryInActiveValidation.validate(req.params, req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const inActiveCategory = await categoryModel.findByIdAndUpdate(
            req.params.id,
            { isActive: isActive },
            { new: true }
        );
        if (!inActiveCategory) {
            return response.error(res, 403, 'Category not found', {});
        };
        return response.success(res, 200, 'Category inActive successfully', inActiveCategory);
    } catch (error) {
        res.status(500).json({ message: "Error deleting category", error });
    };
}
