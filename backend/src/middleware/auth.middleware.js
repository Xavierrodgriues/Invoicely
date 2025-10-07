const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
        req.user = decoded; // attach user info (id, role) to request
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Extra: role-based access
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }
        next();
    };
};

module.exports = { authMiddleware, authorizeRoles };