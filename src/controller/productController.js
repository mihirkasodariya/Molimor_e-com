import model from '../model/productModel.js';
const { productModel, productValidation, updateProductValidation, productFileSchema } = model;
import response from '../utils/response.js';
import { getAvailableFileName } from '../utils/multerStorage.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;
import currency from '../utils/currency.js'
const { convertPrice } = currency;
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

export async function addSingleProduct(req, res) {
    const { title, shortDescription, isFeatured, weight, price, mrp, description, benefits, subCategoryId, image, sku, stock, quantity, isActive } = req.body;

    let isFeaturedConvertArry = [];
    if (isFeatured && typeof isFeatured === 'string') {
        isFeaturedConvertArry = isFeatured.replace(/[\[\]\s]+/g, '').split(',').map(item => item.trim());
    };
    req.body.isFeatured = isFeaturedConvertArry;

    const { error } = productValidation.validate(req.body);
    if (error) {
        return response.error(res, req?.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    try {
        const existingProduct = await productModel.findOne({ sku: sku });
        if (existingProduct) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.PRODUCT_SKU_EXISTS, {});
        };

        const fileNames = req?.files?.image?.map(file => file.filename);
        const createnewProduct = new productModel({
            ...req.body,
            image: fileNames
        });
        await createnewProduct.save();
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_ADDED, createnewProduct);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllProductsList(req, res) {
    try {
        const products = await productModel.find({ isActive: true, isDelete: false }).sort({ createdAt: -1 });
        if (!products?.length === 0) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
        };
        const convertedProducts = await Promise.all(products.map(async (product) => {
            const [convertedPrice, convertedMRP] = await Promise.all([
                convertPrice(product.price, req.currency),
                convertPrice(product.mrp, req.currency)
            ]);

            return {
                ...product._doc,
                price: convertedPrice,
                mrp: convertedMRP,
                currency: req.currency,
                image: product.image?.[0] ? `/productImages/${product.image[0]}` : null
            };
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, convertedProducts);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllAdminProductsList(req, res) {
    try {
        const products = await productModel.find({ isDelete: false }).sort({ createdAt: -1 });
        if (!products?.length === 0) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
        };
        const convertedProducts = await Promise.all(products.map(async (product) => {
            const [convertedPrice, convertedMRP] = await Promise.all([
                convertPrice(product.price, req.currency),
                convertPrice(product.mrp, req.currency)
            ]);

            return {
                ...product._doc,
                price: convertedPrice,
                mrp: convertedMRP,
                currency: req.currency,
                image: product.image?.[0] ? `/productImages/${product.image[0]}` : null
            };
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, convertedProducts);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getProductById(req, res) {
    const { id } = req.params;

    try {
        const product = await productModel.findById(id).populate("subCategoryId");
        if (!product) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
        };
        const [convertedPrice, convertedMRP] = await Promise.all([
            convertPrice(product.price, req.currency),
            convertPrice(product.mrp, req.currency)
        ]);

        const updatedProduct = {
            ...product._doc,
            price: parseFloat(convertedPrice),
            mrp: parseFloat(convertedMRP),
            currency: currency,
            image: Array.isArray(product.image) ? product?.image.map(img => `/productImages/${img}`) : []
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, updatedProduct);
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function updateSingleProduct(req, res) {
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
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };

    try {
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
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
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_UPDATED, updatedProduct);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function inActiveProductById(req, res) {
    const { id } = req.params;
    try {
        const user = await productModel.findById({ _id: id });
        if (!user) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
        };
        const updatedData = {
            isActive: true
        };
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_INACTIVATED, { updatedProduct });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function deleteProductById(req, res) {
    const { id } = req.params;
    try {
        const user = await productModel.findById({ _id: id });
        if (!user) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
        };
        const updatedData = {
            isDelete: true,
            isActive: false
        };
        const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_DELETED, { updatedProduct });
    } catch (err) {
        console.error(err);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function searchProduct(req, res) {
    try {
        const { searchProduct } = req.params;

        const { error } = productValidation.validate(req.body);
        if (error) {
            return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
        };

        const products = await productModel.find({
            $or: [
                { title: { $regex: searchProduct, $options: 'i' } },
                { shortDescription: { $regex: searchProduct, $options: 'i' } }
            ]
        });
        if (!products?.length) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_MATCHING_PRODUCTS, {});
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, products);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function downloadAddBulkProductTemplate(req, res) {
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
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.FILE_READY, { url: downloadUrl });
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function uploadBulkProductsFile(req, res) {
    try {
        if (!req.file) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_FILE_UPLOADED, {});
        };
        const workbook = xlsx.readFile(req.file.path);
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        const products = data.map((row, i) => {
            const { error, value } = productFileSchema.validate(row);
            if (error) {
                return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
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
        response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessagePRODUCTS_UPLOADED, {});
    } catch (error) {
        if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};


