const { categoryModel, categoryValidation, categoryIdValidation, categoryInActiveValidation } = require("../model/categoryModel");
const response = require('../utils/response');

exports.addCategory = async (req, res) => {
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
};

exports.getCategoryList = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        return response.success(res, 200, 'Categories fetched successfully', categories);
    } catch (error) {
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};


exports.getCategoryById = async (req, res) => {
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
};

exports.updateCategory = async (req, res) => {
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
};

exports.inActiveCategory = async (req, res) => {
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
};
