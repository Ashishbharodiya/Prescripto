const errorHandler = (req, res, next) => {
    return res.status(404).json({ success: false, message: 'Not Found' });
};

module.exports = errorHandler;
