import model from '../model/productModel.js';
const { productModel, productValidation, updateProductValidation, productFileSchema } = model;
import response from '../utils/response.js';
import { getAvailableFileName } from '../utils/multerStorage.js';
import categoryMdl from '../model/categoryModel.js'
const { categoryModel } = categoryMdl;
import orderMdl from '../model/orderModel.js'
const { orderModel } = orderMdl;
import reviewMdl from '../model/reviewModel.js'
const { reviewModel } = reviewMdl;
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;
import currency from '../utils/currency.js'
const { convertPrice } = currency;
import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import saleModel from '../model/productSaleModel.js'
const { productSaleModel } = saleModel;
import wishModel from '../model/wishlistModel.js';
const { wishlistModel } = wishModel;


export async function addSingleProduct(req, res) {
    const { title, isFeatured, variants, isSale, salePrice, startSaleOn, endSaleOn, description, benefits, categoryId, image, sku, hsnCode, gst, stock, quantity, isActive } = req.body;
    let parsedVariants = [];
    parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;

    let isFeaturedConvertArry = [];
    if (isFeatured && typeof isFeatured === 'string') {
        isFeaturedConvertArry = isFeatured.replace(/[\[\]\s]+/g, '').split(',').map(item => item.trim());
    };
    console.log('variants', parsedVariants)
    // if (weight && typeof weight === 'string') {
    //     weightArry = weight.replace(/[\[\]\s]+/g, '').split(',').map(item => item.trim());
    // };
    req.body.isFeatured = isFeaturedConvertArry;
    // req.body.weight = weightArry;
    let variantsArry = [];
    parsedVariants.forEach(variant => {
        console.log(variant.weight, variant.price, variant.mrp);
        variantsArry.push(variant);
    });
    req.body.variants = variantsArry;

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
            gst: gst + "%",
            image: fileNames
        });
        await createnewProduct.save();

        const saveSale = await new productSaleModel({
            productId: createnewProduct?._id,
            isSale,
            salePrice,
            startSaleOn,
            endSaleOn
        });
        await saveSale.save();

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCT_ADDED, createnewProduct);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

// export async function getAllProductsList(req, res) {
//     try {
//         const {
//             category,
//             status,
//             minPrice,
//             maxPrice,
//             weight,
//             review
//         } = req.query;

//         const filter = {
//             isActive: true,
//             isDelete: false
//         };

//         if (review) {
//             const ratingValue = parseFloat(review);
//             if (ratingValue >= 1 && ratingValue <= 5) {
//                 const reviewedProducts = await reviewModel.aggregate([
//                     { $match: { isActive: true } },
//                     {
//                         $group: {
//                             _id: "$productId",
//                             averageRating: { $avg: "$rating" }
//                         }
//                     },
//                     { $match: { averageRating: { $gte: ratingValue } } }
//                 ]);
//                 const matchingProductIds = reviewedProducts.map(item => item._id);
//                 filter._id = { $in: matchingProductIds };
//             }
//         }

//         if (category) {
//             const categoryDoc = await categoryModel.findOne({ name: category });
//             if (categoryDoc) {
//                 filter.categoryId = categoryDoc._id;
//             } else {
//                 return response.error(res, req?.languageCode, resStatusCode.NOT_FOUND, "Category not found", {});
//             };
//         };

//         if (status === 'instock') {
//             filter.quantity = { $gt: 0 };
//         } else if (status === 'outofstock') {
//             filter.quantity = 0;
//         };

//         if (weight) {
//             filter.weight = { $in: [weight] };
//         };

//         if (minPrice || maxPrice) {
//             const allProducts = await productModel.find(filter).populate('categoryId');
//             const priceFiltered = [];

//             for (const product of allProducts) {
//                 const convertedPrice = await convertPrice(product.price, req.currency);
//                 const price = parseFloat(convertedPrice);

//                 if ((!minPrice || price >= parseFloat(minPrice)) && (!maxPrice || price <= parseFloat(maxPrice))) {
//                     priceFiltered.push(product);
//                 };
//             };

//             if (priceFiltered.length === 0) {
//                 return response.error(res, req?.languageCode, resStatusCode.NOT_FOUND, resMessage.NO_PRODUCTS_FOUND, {});
//             };

//             const convertedProducts = await Promise.all(priceFiltered.map(async (product) => {
//                 const [convertedPrice, convertedMRP] = await Promise.all([
//                     convertPrice(product.price, req.currency),
//                     convertPrice(product.mrp, req.currency)
//                 ]);

//                 return {
//                     ...product._doc,
//                     price: convertedPrice,
//                     mrp: convertedMRP,
//                     currency: req.currency,
//                     image: product.image?.[0] ? `/productImages/${product.image[0]}` : null,
//                     stockStatus: product.quantity > 0 ? 'instock' : 'outofstock'
//                 };
//             }));

//             return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, convertedProducts);
//         };

//         const products = await productModel.aggregate([
//             { $match: filter },
//             { $sort: { createdAt: -1 } },
//             {
//                 $lookup: {
//                     from: 'sale_products',
//                     localField: '_id',
//                     foreignField: 'productId',
//                     as: 'salesInfo'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$salesInfo',
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'categorys',
//                     localField: 'categoryId',
//                     foreignField: '_id',
//                     as: 'category'
//                 }
//             },
//             {
//                 $unwind: {
//                     path: '$category',
//                     preserveNullAndEmptyArrays: true
//                 }
//             }
//         ]);

//         if (!products?.length) {
//             return response.error(res, req?.languageCode, resStatusCode.NOT_FOUND, resMessage.NO_PRODUCTS_FOUND, {});
//         };

//         const convertedProducts = await Promise.all(products.map(async (product) => {
//             const [convertedPrice, convertedMRP] = await Promise.all([
//                 convertPrice(product.price, req.currency),
//                 convertPrice(product.mrp, req.currency)
//             ]);

//             return {
//                 ...product,
//                 price: convertedPrice,
//                 mrp: convertedMRP,
//                 currency: req.currency,
//                 image: product.image?.[0] ? `/productImages/${product.image[0]}` : null,
//                 stockStatus: product.quantity > 0 ? 'instock' : 'outofstock'
//             };
//         }));
//         return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, convertedProducts);
//     } catch (error) {
//         console.error(error);
//         return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
//     };
// };
// added gtp 
export async function getAllProductsList(req, res) {
  try {
    const {
      category,
      status,
      minPrice,
      maxPrice,
      review,
      minWeight,
      maxWeight,
      page = 1,
      limit = 10,
      userId
    } = req.query;

    const filter = {
      isActive: true,
      isDelete: false
    };

    // 1. Apply review filter (product IDs with avg rating >= review)
    if (review) {
      const ratingValue = parseFloat(review);
      if (ratingValue >= 1 && ratingValue <= 5) {
        const reviewedProducts = await reviewModel.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: "$productId",
              averageRating: { $avg: "$rating" }
            }
          },
          { $match: { averageRating: { $gte: ratingValue } } }
        ]);
        const matchingProductIds = reviewedProducts.map(item => item._id);
        filter._id = { $in: matchingProductIds };
      }
    }

    // 2. Category filter
    if (category) {
      const categoryDoc = await categoryModel.findOne({ name: category });
      if (categoryDoc) {
        filter.categoryId = categoryDoc._id;
      }
    }

    // 3. Stock filter
    if (status === 'instock') {
      filter.quantity = { $gt: 0 };
    } else if (status === 'outofstock') {
      filter.quantity = 0;
    }

    // --- Build aggregation pipeline ---
    const pipeline = [
      { $match: filter },

      // Unwind variants for filtering on variants.weight and variants.price
      { $unwind: '$variants' },

      // Convert variants.weight from string like "230g" to integer numericWeight
      {
        $addFields: {
          numericWeight: {
            $toInt: {
              $arrayElemAt: [
                { $split: ['$variants.weight', 'g'] },
                0
              ]
            }
          }
        }
      }
    ];

    // 4. Weight filter on variants.weight
    if (minWeight || maxWeight) {
      pipeline.push({
        $match: {
          numericWeight: {
            ...(minWeight ? { $gte: parseInt(minWeight) } : {}),
            ...(maxWeight ? { $lte: parseInt(maxWeight) } : {})
          }
        }
      });
    }

    // 5. Price filter on variants.price (note: price is a Number)
    const minPriceNum = minPrice !== undefined && minPrice !== 'undefined' ? parseFloat(minPrice) : null;
    const maxPriceNum = maxPrice !== undefined && maxPrice !== 'undefined' ? parseFloat(maxPrice) : null;

    if (minPriceNum !== null || maxPriceNum !== null) {
      // If you want to filter based on converted price, you need to convert price here
      // but conversion is async (e.g. currency conversion), so for now, filter on stored price directly
      pipeline.push({
        $match: {
          'variants.price': {
            ...(minPriceNum !== null ? { $gte: minPriceNum } : {}),
            ...(maxPriceNum !== null ? { $lte: maxPriceNum } : {})
          }
        }
      });
    }

    // 6. Sort, Pagination
    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    );

    // 7. Lookup category details
    pipeline.push({
      $lookup: {
        from: 'categorys',
        localField: 'categoryId',
        foreignField: '_id',
        as: 'category'
      }
    });
    pipeline.push({ $unwind: { path: '$category', preserveNullAndEmptyArrays: true } });

    // 8. Lookup sale_products info
    pipeline.push({
      $lookup: {
        from: 'sale_products',
        localField: '_id',
        foreignField: 'productId',
        as: 'salesInfo'
      }
    });
    pipeline.push({ $unwind: { path: '$salesInfo', preserveNullAndEmptyArrays: true } });

    // 9. Group back by product _id to reconstruct variants array (optional)
    //    Or you can keep it unwound if you want to return product+variant per document

    // Let's group to reconstruct product with filtered variants
    pipeline.push({
      $group: {
        _id: '$_id',
        doc: { $first: '$$ROOT' },
        variants: { $push: '$variants' }
      }
    });

    pipeline.push({
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$doc', { variants: '$variants' }]
        }
      }
    });

    // Execute pipeline
    const filteredProducts = await productModel.aggregate(pipeline);

    if (!filteredProducts.length) {
      return response.success(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
    }

    // 10. Convert prices async & add wishlist info
    const convertedProducts = await Promise.all(filteredProducts.map(async product => {
      // Choose variant with lowest price for display (or modify as needed)
      const variantToShow = product.variants[0];

      const [convertedPrice, convertedMRP] = await Promise.all([
        convertPrice(variantToShow.price, req.currency),
        convertPrice(variantToShow.mrp, req.currency)
      ]);

      let isWishListExists = false;
      if (userId) {
        isWishListExists = await wishlistModel.findOne({
          userId,
          'items.productId': product._id,
          isActive: true
        }).populate('items.productId');
      }

      return {
        ...product,
        price: convertedPrice,
        mrp: convertedMRP,
        currency: req.currency,
        variants: product.variants,
        image: product.image?.[0] ? `/productImages/${product.image[0]}` : null,
        stockStatus: product.quantity > 0 ? 'instock' : 'outofstock',
        isWishList: !!isWishListExists,
        category: product.category
      };
    }));

    // 11. Count total records for pagination (if you want exact total, run separate count pipeline without $skip/$limit)
    // Here you can run a count pipeline without $skip/$limit to get total count for frontend pagination
    // But for simplicity, use filteredProducts.length as total count for current page only

    return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, {
      page: parseInt(page),
      limit: parseInt(limit),
      totalRecords: convertedProducts.length, // replace with total count if implemented
      totalPages: 1, // replace with total pages if total count implemented
      products: convertedProducts
    });

  } catch (error) {
    console.error('Error in getAllProductsList:', error);
    return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
  }
}


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
        const product = await productModel.findById(id).populate("categoryId");
        if (!product) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_PRODUCTS_FOUND, {});
        };
        // const [convertedPrice, convertedMRP] = await Promise.all([
        //     convertPrice(product.price, req.currency),
        //     convertPrice(product.mrp, req.currency)
        // ]);
        let isWishListExists = false
        if (req?.query?.userId) {
            isWishListExists = await wishlistModel.findOne({
                userId: req?.query?.userId,
                'items.productId': product._id,
                isActive: true
            }).populate('items.productId');
        };
        const updatedProduct = {
            ...product._doc,
            isWishList: !!isWishListExists,
            // price: parseFloat(convertedPrice),
            // mrp: parseFloat(convertedMRP),
            currency: req.currency,
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
    let variants = req.body.variants;
    let isFeaturedConvertArry = [];
    // let weightArry = [];
    if (req.body.isFeatured && typeof req.body.isFeatured === 'string') {
        isFeaturedConvertArry = req.body.isFeatured
            .replace(/[\[\]\s]+/g, '')
            .split(',')
            .map(item => item.trim());
        req.body.isFeatured = isFeaturedConvertArry;
    };
    // console.log('req.body?.weight', req.body?.weight)
    // if (req.body?.weight && typeof req.body?.weight === 'string') {
    // weightArry = req.body?.weight.replace(/[\[\]\s]+/g, '').split(',').map(item => item.trim());
    // };
    let variantsArry = [];
    let parsedVariants = [];
    parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;

    parsedVariants.forEach(variant => {
        console.log(variant.weight, variant.price, variant.mrp);
        variantsArry.push(variant);
    });
    req.body.variants = parsedVariants;
    // req.body.weight = weightArry;

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
        const { searchProduct } = req?.query;

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

        let wishlistProductIds = [];
        if (req?.query?.userId) {
            const wishlist = await wishlistModel.findOne({
                userId: req.query.userId,
                isActive: true
            });

            if (wishlist) {
                wishlistProductIds = wishlist.items.map(item =>
                    item.productId.toString()
                );
            }
        }
        const productsWithWishlist = products.map(product => {
            const isWishlisted = wishlistProductIds.includes(product._id.toString());
            const imagesWithPath = product.image.map(img => `/productImages/${img}`);

            return {
                ...product._doc,
                image: imagesWithPath,
                isWishList: !!isWishlisted
            };
        });

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, productsWithWishlist);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function downloadAddBulkProductTemplate(req, res) {

    try {
        const data = [
            {
                title: "",
                // shortDescription: "",
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
                categoryId: "",
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


export async function getPopularProductList(req, res) {
    try {
        const topOrderedProducts = await orderModel.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.productId",
                    totalOrders: { $sum: "$items.quantity" },
                },
            },
            { $sort: { totalOrders: -1 } },
            { $limit: 50 },
        ]);

        const topProductIds = topOrderedProducts.map((p) => p._id);

        const result = await productModel.aggregate([
            {
                $facet: {
                    primary: [
                        {
                            $match: {
                                $or: [
                                    { _id: { $in: topProductIds } },
                                    { isPopular: true },
                                ],
                            },
                        },
                        { $limit: 6 },
                    ],
                    secondary: [
                        {
                            $match: {
                                isPopular: true,
                                _id: { $nin: topProductIds },
                            },
                        },
                        { $limit: 6 },
                    ],
                },
            },
            {
                $project: {
                    combined: {
                        $concatArrays: [
                            "$primary",
                            {
                                $slice: [
                                    "$secondary",
                                    { $subtract: [12, { $size: "$primary" }] },
                                ],
                            },
                        ],
                    },
                },
            },
            { $unwind: "$combined" },
            { $replaceRoot: { newRoot: "$combined" } },
            {
                $lookup: {
                    from: "categorys",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "sale_products",
                    localField: "_id",
                    foreignField: "productId",
                    as: "sales",
                },
            },
            {
                $unwind: {
                    path: "$sales",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ]);
        const popularProducts = await Promise.all(
            result.map(async (product) => {
                let isWishListExists = false;
                if (req?.query?.userId) {
                    isWishListExists = await wishlistModel.findOne({
                        userId: req?.query?.userId,
                        'items.productId': product?._id,
                        isActive: true
                    }).populate('items.productId');
                };
                return {
                    ...product,
                    image: product.image?.map((img) => `/productImages/${img}`) || [],
                    isWishList: !!isWishListExists,
                };
            })
        );


        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.PRODUCTS_RETRIEVED, popularProducts);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
}

export async function getBigSalesProducts(req, res) {
    try {
        const today = new Date();

        const products = await productModel.aggregate([
            {
                $match: {
                    isDelete: false,
                    isActive: true,
                },
            },
            {
                $lookup: {
                    from: "sale_products",
                    localField: "_id",
                    foreignField: "productId",
                    as: "sales",
                },
            },
            { $unwind: "$sales" },
            {
                $match: {
                    "sales.isSale": true,
                    "sales.startSaleOn": { $lte: today },
                    "sales.endSaleOn": { $gte: today },
                },
            },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" },
                    // weight: { $first: "$weight" },
                    // price: { $first: "$price" },
                    // mrp: { $first: "$mrp" },
                    variants: { $first: "$variants" },
                    image: { $first: "$image" },
                    sku: { $first: "$sku" },
                    stock: { $first: "$stock" },
                    quantity: { $first: "$quantity" },
                    isDelete: { $first: "$isDelete" },
                    isActive: { $first: "$isActive" },
                    isPopular: { $first: "$isPopular" },
                    saleId: { $first: "$sales._id" },
                    salePrice: { $first: "$sales.salePrice" },
                    isSale: { $first: "$sales.isSale" },
                    startSaleOn: { $first: "$sales.startSaleOn" },
                    endSaleOn: { $first: "$sales.endSaleOn" },
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    // weight: 1,
                    // price: 1,
                    // mrp: 1,
                    variants:1,
                    image: 1,
                    sku: 1,
                    stock: 1,
                    quantity: 1,
                    isDelete: 1,
                    isActive: 1,
                    isPopular: 1,
                    saleId: 1,
                    salePrice: 1,
                    isSale: 1,
                    startSaleOn: 1,
                    endSaleOn: 1,
                },
            },
        ]);

        const daily = [];
        const weekly = [];
        const monthly = [];

        for (const product of products) {
            let isWishListExists = false;
            if (req?.query?.userId) {
                isWishListExists = await wishlistModel.findOne({
                    userId: req.query.userId,
                    'items.productId': product._id,
                    isActive: true
                }).populate('items.productId');
            };

            const productWithWishlist = {
                ...product,
                isWishList: !!isWishListExists,
                image: product.image.map((img) => `/productImages/${img}`)
            };


            const start = new Date(product.startSaleOn);
            const end = new Date(product.endSaleOn);

            const durationInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

            if (durationInDays <= 1) {
                daily.push(productWithWishlist);
            } else if (durationInDays <= 7) {
                weekly.push(productWithWishlist);
            } else {
                monthly.push(productWithWishlist);
            }
        }

        res.status(200).json({
            success: true,
            message: "Sale products retrieved successfully",
            data: {
                daily,
                weekly,
                monthly,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching sale products",
            error: error.message,
        });
    }
}



