module.exports = class response {
    static success = (res, status, message, data) => {
        return res.status(status || 200).json({
            success: true,
            status: status || 200,
            message: message || 'success',
            data: data || {},
        });
    };

    static error = (res, status, message, data) => {
        return res.status(status || 200).json({
            success: false,
            status: status || 403,
            message: message || 'error',
            data: data || {},
        });
    };
};