const jwt = require("jsonwebtoken");

// Optional auth: attaches req.user if token present, but doesn't block if missing
module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.id || decoded.userId, email: decoded.email, name: decoded.name };
        next();
    } catch (err) {
        req.user = null;
        next();
    }
};
