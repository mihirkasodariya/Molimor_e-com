const { orderModel, orderValidation, getOrderValidation } = require('../model/orderModel');
const response = require('../utils/response');
module.exports.placeOrder = async (req, res) => {
    const { fname, lname, cartItems, paymentMethod, streetAddress, country, state, pincode, shippingAddress, shippingCharge, mobile, email, orderNote } = req.body;

    const { error } = orderValidation.validate(req.body);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        let totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

        let lastOrder = await orderModel.findOne({}).sort({ orderId: -1 }).select(orderId);
        var orderId = (parseInt(lastOrder?.orderId) + 2).toString();

        if (!lastOrder) {
            orderId = Math.floor(100000 + Math.random() * 900000);
        };
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
            shippingCharge,
            mobile,
            email,
            totalAmount,
            orderNote
        });

        return response.success(res, 201, 'Order placed successfully', order);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.getAllUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        let orders = await orderModel.find({ userId }).populate("items.productId").sort({ createdAt: -1 });

        if (!orders || orders?.length === 0) {
            return response.error(res, 403, 'No orders found');
        };
        const updatedOrders = orders.map(order => {
            const updatedItems = order.items.map(item => {
                if (item.productId && Array.isArray(item.productId.image)) {
                    item.productId.image = item.productId.image.map(img =>
                        img.startsWith("/productImages/") ? img : `/productImages/${img}`
                    );
                }
                return item;
            });
            return { ...order._doc, items: updatedItems };
        });
        return response.success(res, 200, 'Orders retrieved successfully', updatedOrders);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.getOrderById = async (req, res) => {
    const orderId = req.params.id;
    const { error } = getOrderValidation.validate(req.params);
    if (error) {
        return response.error(res, 400, error.details[0].message);
    };
    try {
        const order = await orderModel.findOne({ orderId: orderId}).populate("items.productId");
        if (!order) {
            return response.error(res, 403, 'Order not found.');
        };
        const updatedItems = order.items.map(item => {
            if (item.productId && Array.isArray(item.productId.image)) {
                item.productId.image = item.productId.image.map(img =>
                    img.startsWith("/productImages/")
                        ? img
                        : `/productImages/${img}`
                );
            }
            return item;
        });
        const updatedOrder = { ...order._doc, items: updatedItems };

        return response.success(res, 200, 'Order retrieved successfully', updatedOrder);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

// admin
module.exports.getAllOrders = async (req, res) => {
    try {
        const { status, customerId, startDate, endDate, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (customerId) filter.customerId = customerId;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        };
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalOrders = await orderModel.countDocuments(filter);

        let orders = await orderModel
            .find(filter)
            .populate("items.productId")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        if (!orders || orders.length === 0) {
            return response.error(res, 404, 'No orders found');
        };

        const updatedOrders = orders.map(order => {
            const updatedItems = order.items.map(item => {
                if (item.productId && Array.isArray(item.productId.image)) {
                    item.productId.image = item.productId.image.map(img =>
                        img.startsWith("/productImages/") ? img : `/productImages/${img}`
                    );
                };
                return item;
            });
            return { ...order._doc, items: updatedItems };
        });

        const totalPages = Math.ceil(totalOrders / parseInt(limit));

        return response.success(res, 200, 'Orders retrieved successfully', {
            orders: updatedOrders,
            page: parseInt(page),
            limit: parseInt(limit),
            totalRecords : totalOrders,
            totalPages: totalPages
        });

    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});
    };
};

module.exports.updateOrderStatusByAdmin = async (req, res) => {

    try {
        return response.success(res, 200, 'Order status updated successfully', updatedOrder);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});  
    };
};

module.exports.assignOrderCourierPatner = async (req, res) => {
    try {

        return response.success(res, 200, 'Courier partner assigned and order status updated successfully', updatedOrder);
    } catch (error) {
        console.error(error);
        return response.error(res, 500, 'Oops! Something went wrong. Our team is looking into it.', {});  
    };
};