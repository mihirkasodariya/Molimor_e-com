import model from '../model/orderModel.js';
const { orderModel, orderValidation, getOrderValidation } = model;
import response from '../utils/response.js';
import constants from '../utils/constants.js';
const { resStatusCode, resMessage } = constants;
import currency from '../utils/currency.js'
const { convertPrice } = currency;
import { sendNotification } from '../utils/sendNotification.js';
import userModelfile from '../model/userModel.js';
const { userModel } = userModelfile;
import productModelfile from '../model/productModel.js';
const { productModel } = productModelfile;
import { Types } from 'mongoose';
import cartMdl from '../model/cartModel.js';
const { cartModel } = cartMdl
export async function placeOrder(req, res) {
    const { fname, lname, cartItems, paymentMethod, streetAddress, country, state, pincode, shippingAddress, shippingCountry, shippingState, shippingPincode, shippingCharge, mobile, email, orderNote } = req.body;

    const { error } = orderValidation.validate(req.body);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error?.details[0].message);
    };
    try {
        let totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        let lastOrder = await orderModel.findOne({}).sort({ orderId: -1 }).select(orderId);
        var orderId = (parseInt(lastOrder?.orderId) + 2).toString();

        if (!lastOrder) {
            orderId = Math.floor(100000 + Math.random() * 900000);
        };
        console.log('dsjhfsgdjh')
        const order = await orderModel.create({
            orderId: orderId,
            userId: req.user.id,
            fname,
            lname,
            items: cartItems,
            paymentMethod,
            streetAddress,
            country,
            state,
            pincode,
            shippingAddress,
            shippingCountry,
            shippingCharge,
            shippingState,
            shippingPincode,
            mobile,
            email,
            totalAmount,
            orderNote: orderNote || ""
        });
        console.log('order', order)
        const fullName = `${fname} ${lname}`;
        const orderSummary = cartItems.slice(0, 2).map(i => `${i.quantity}x Item`).join(', ') + (cartItems.length > 2 ? '...' : '');

        const adminFcmToken = await userModel.findById({ _id: req.user.id });

        const productIds = cartItems.map(item => new Types.ObjectId(item.productId));

        const orderedProducts = await productModel.find({
            _id: { $in: productIds }
        });
        const productSkus = orderedProducts.map(product => product.sku).join(', ');


        await sendNotification(
            adminFcmToken.fcm,
            {
                title: '🛒 New Order Placed!',
                body: `Order #${orderId} by ${fullName} for ₹${totalAmount}`
            },
            {
                orderId,
                customerName: fullName,
                totalAmount: totalAmount.toString(),
                paymentMethod,
                mobile,
                email,
                shippingCharge,
                SKU: productSkus,
                totalItem: cartItems.length.toString(),
                address: {
                    streetAddress: streetAddress.join(', '),
                    shippingAddress: shippingAddress,
                    state,
                    country,
                    pincode
                },
                orderNote,
                orderSummary
            }
        );
        await cartModel.updateOne(
            { userId: req.user.id },
            { $pull: { items: { productId: { $in: productIds } } } }
        );

        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ORDER_PLACED, order);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getAllUserOrders(req, res) {
    try {
        const userId = req.user.id;
        console.log('req.user.id', req.user.id)
        let orders = await orderModel.find({ userId: req.user.id }).populate("items.productId").sort({ createdAt: -1 });
        console.log('orders', orders)
        if (!orders || orders?.length === 0) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_ORDERS_FOUND, {});
        };

        const updatedOrders = await Promise.all(orders.map(async (order) => {
            // const convertedPrice = await convertPrice(order.price, req.currency);
            // const convertedMRP = await convertPrice(order.mrp, req.currency);
            const updatedItems = order.items.map(item => {
                if (item.productId && Array.isArray(item.productId.image)) {
                    item.productId.image = item.productId.image.map(img =>
                        img.startsWith("/productImages/") ? img : `/productImages/${img}`
                    );
                }
                return item;
            });
            return order
        }));
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ORDERS_RETRIEVED, updatedOrders);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function getOrderById(req, res) {
    const orderId = req.params.id;
    const { error } = getOrderValidation.validate(req.params);
    if (error) {
        return response.error(res, req.languageCode, resStatusCode.CLIENT_ERROR, error.details[0].message);
    };
    try {
        const order = await orderModel.findOne({ orderId: orderId }).populate("items.productId");
        console.log('order', order.userId)
        if (!order) {
            return response.error(res, req?.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_ORDERS_FOUND, {});
        };
        const user = await userModel.findById({ _id: order.userId }).select('-password');
        const [convertedPrice, convertedMRP] = await Promise.all([
            convertPrice(order?.price, req?.currency),
            convertPrice(order?.mrp, req?.currency)
        ]);
        const updatedItems = order.items.map(item => {
            if (item.productId && Array.isArray(item.productId.image)) {
                item.productId.image = item.productId.image.map(img =>
                    img.startsWith("/productImages/")
                        ? img
                        : `/productImages/${img}`
                );
            };
            return item;
        });
        const updatedOrder = {
            ...order._doc,
            user: user,
            price: convertedPrice,
            mrp: convertedMRP,
            items: updatedItems
        };
        return response.success(res, req?.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ORDERS_RETRIEVED, updatedOrder);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

// admin
export async function getAllOrders(req, res) {
    try {
        const { status, customerId, startDate, endDate, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (customerId) filter.customerId = customerId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalOrders = await orderModel.countDocuments(filter);

        const orders = await orderModel
            .find(filter)
            .populate("items.productId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        if (!orders || orders.length === 0) {
            return response.error(res, req.languageCode, resStatusCode.FORBIDDEN, resMessage.NO_ORDERS_FOUND, {});
        }

        const updatedOrders = await Promise.all(orders.map(async (order) => {
            const convertedPrice = await convertPrice(order.price, req.currency);
            const convertedMRP = await convertPrice(order.mrp, req.currency);

            const updatedItems = order.items.map(item => {
                if (item.productId && Array.isArray(item.productId.image)) {
                    item.productId.image = item.productId.image.map(img =>
                        img.startsWith("/productImages/") ? img : `/productImages/${img}`
                    );
                }
                return item;
            });

            return {
                ...order,
                price: convertedPrice,
                mrp: convertedMRP,
                items: updatedItems,
            };
        }));

        const totalPages = Math.ceil(totalOrders / parseInt(limit));

        return response.success(res, req.languageCode, resStatusCode.ACTION_COMPLETE, resMessage.ORDERS_RETRIEVED, {
            orders: updatedOrders,
            page: parseInt(page),
            limit: parseInt(limit),
            totalRecords: totalOrders,
            totalPages: totalPages
        });

    } catch (error) {
        console.error(error);
        return response.error(res, req.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    }
};

export async function updateOrderStatusByAdmin(req, res) {

    try {
        return response.success(res, req?.languageCode, 200, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};

export async function assignOrderCourierPatner(req, res) {
    try {
        return response.success(res, req?.languageCode, 200, 'Courier partner assigned and order status updated successfully', updatedOrder);
    } catch (error) {
        console.error(error);
        return response.error(res, req?.languageCode, resStatusCode.INTERNAL_SERVER_ERROR, resMessage.INTERNAL_SERVER_ERROR, {});
    };
};