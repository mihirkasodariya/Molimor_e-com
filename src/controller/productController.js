const { productModel, productValidation, updateProductValidation, productFileSchema} = require('../model/productModel');
const response = require('../utils/response');
const { getAvailableFileName } = require('../utils/commonFunctions');
module.exports.addSingleProduct = async (req, res) => {
    const { title, shortDescription, isFeatured, weight, price, mrp, description, benefits, subCategoryId, image, sku, stock, quantity, isActive } = req.body;

    let isFeaturedConvertArry = [];
    if (isFeatured && typeof isFeatured === 'string') {
        isFeaturedConvertArry = isFeatured.replace(/[\[\]\s]+/g, '').split(',').map(item => item.trim());
    };
    req.body.isFeatured = isFeaturedConvertArry;

    const { error } = productValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };

    try {
        const existingProduct = await productModel.findOne({ sku: sku });
        if (existingProduct) {
            return response.error(res, 403, 'Product with this SKU already exists', {});
        };

        const fileNames = req?.files?.image?.map(file => file.filename);
        const createnewProduct = new productModel({
            ...req.body,
            image: fileNames
        });
        await createnewProduct.save();
        return response.success(res, 200, 'Product added successfully', createnewProduct);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.getAllProductsList = async (req, res) => {
    try {
        const products = await productModel.find({isActive : true, isDelete : false}).sort({ createdAt: -1 });
        if (!products?.length === 0) {
            return response.error(res, 403, 'No products found', {});
        };
        const changeResponse = products.map(product => ({
            ...product._doc,
            image: product.image?.[0] ? `/productImages/${product.image[0]}` : null
        }));
        return response.success(res, 200, 'Products retrieved successfully', changeResponse);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    }
};

module.exports.getAllAdminProductsList = async (req, res) => {
    try {
        const products = await productModel.find({isDelete : false}).sort({ createdAt: -1 });
        if (!products?.length === 0) {
            return response.error(res, 403, 'No products found', {});
        };
        const changeResponse = products.map(product => ({
            ...product._doc,
            image: product.image?.[0] ? `/productImages/${product.image[0]}` : null
        }));
        return response.success(res, 200, 'Products retrieved successfully', changeResponse);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    }
};
module.exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productModel.findById(id).populate("subCategoryId");
        if (!product) {
            return response.error(res, 403, 'No product available at the moment.');
        };
        const updatedProduct = {
            ...product._doc,
            image: Array.isArray(product.image) ? product?.image.map(img => `/productImages/${img}`) : []
        };
        return response.success(res, 200, 'Product fetched successfully.', updatedProduct);
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Something went wrong. Please try again later.');
    };
};

module.exports.updateSingleProduct = async (req, res) => {
    const { id } = req.params;

    let isFeaturedConvertArry = [];
    if (req.body.isFeatured && typeof req.body.isFeatured === 'string') {
        isFeaturedConvertArry = req.body.isFeatured
            .replace(/[\[\]\s]+/g, '')
            .split(',')
            .map(item => item.trim());
        req.body.isFeatured = isFeaturedConvertArry;
    };
    const { error } = updateProductValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };

    try {
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return response.error(res, 404, 'Product not found');
        };

        const uploadedFiles = req?.files?.image?.map(file => file.filename) || [];
        let updatedImages = existingProduct.image;

        if (uploadedFiles.length > 0) {
            updatedImages = uploadedFiles;
        };
        delete req.body.sku;

        const updatedData = {
            ...req.body,
            image: updatedImages,
        };

        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true, });
        return response.success(res, 200, 'Product updated successfully', updatedProduct);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.');
    };
};

module.exports.inActiveProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await productModel.findById({ _id: id });
        if (!user) {
            return response.error(res, 403, 'Product not found.', {});
        };
        const updatedData = {
            isActive: true
        };
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
        return response.success(res, 200, 'Product has been deleted successfully.', { updatedProduct });
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Something went wrong. Please try again later.');
    };
};

module.exports.deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await productModel.findById({ _id: id });
        if (!user) {
            return response.error(res, 403, 'Product not found.', {});
        };
        const updatedData = {
            isDelete: true,
            isActive: false
        };
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
        return response.success(res, 200, 'Product has been deleted successfully.', { updatedProduct });
    } catch (err) {
        console.error(err);
        return response.error(res, 500, 'Something went wrong. Please try again later.');
    };
};

module.exports.searchProduct = async (req, res) => {
    try {
        const { searchProduct } = req.params;

        const { error } = productValidation.validate(req.body);
        if (error) {
            return response.error(res, 400, error.details[0].message);
        };

        const products = await productModel.find({
            $or: [
                { title: { $regex: searchProduct, $options: 'i' } },
                { shortDescription: { $regex: searchProduct, $options: 'i' } }
            ]
        });
        if (!products?.length) {
            return response.error(res, 403, 'No products matched your search.', {});
        };
        return response.success(res, 200, 'Products found successfully.', { products });
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.downloadAddBulkProductTemplate = async (req, res) => {
    const xlsx = require('xlsx');
    const path = require('path');
    const fs = require('fs');
    const { subCategoryId } = req.body;

    try {
        const data = [
            {
                title: "",
                shortDescription: "",
                isFeatured1: "",
                isFeatured2: "",
                isFeatured3: "",
                isFeatured4: "",
                isFeatured5: "",
                isFeatured6: "",
                weight: "",
                price: 0,
                mrp: 0,
                description: "",
                benefits: "",
                subCategoryId: subCategoryId,
                image1: "",
                image2: "",
                image3: "",
                image4: "",
                image5: "",
                sku: "",
                stock: 1,
                quantity: 1,
                isActive: true
            }
        ];

        const ws = xlsx.utils.json_to_sheet(data);
        const wb = xlsx.utils.book_new();

        xlsx.utils.book_append_sheet(wb, ws, 'Products');
        // xlsx.utils.sheet_add_aoa(wb, ws, { origin: ["N2"] });

        const dir = path.join(__dirname, '../../public/file');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const filePath = getAvailableFileName(dir, 'product_template', 'xlsx');
        xlsx.writeFile(wb, filePath, {
            bookType: 'xlsx',
            cellStyles: true
        });

        const downloadUrl = `/file/${path.basename(filePath)}`;
        return response.success(res, 200, 'File is ready for download.', { url: downloadUrl });
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    }
};

module.exports.uploadBulkProductsFile = async (req, res) => {
    const xlsx = require('xlsx');
    const path = require('path');
    const fs = require('fs');
    try {
      if (!req.file) {
        return response.error(res, 403, 'No file uploaded.', {});
      }
      const workbook = xlsx.readFile(req.file.path);
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
  
      const products = data.map((row, i) => {
        const { error, value } = productFileSchema.validate(row);
        if (error) {
            return response.error(res, 400, error.details[0].message);
        };

        return {
          ...value,
          isActive: value.isActive === true || value.isActive === 'true',
          isFeatured: [
            value.isFeatured1 || '',
            value.isFeatured2,
            value.isFeatured3,
            value.isFeatured4,
            value.isFeatured5,
            value.isFeatured6,
          ],
          image: [
            value.image1 || '',
            value.image2,
            value.image3,
            value.image4,
            value.image5,
          ]
        };
      });
  
      await productModel.insertMany(products);
      fs.unlinkSync(req.file.path);
      response.success(res, 200, 'Products uploaded successfully!', {});

    } catch (error) {
      if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    }
  };


