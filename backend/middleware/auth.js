const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'الوصول غير مصرح به. الرجاء تسجيل الدخول.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        req.user = user;
        req.user.userId = user.id_user;
        req.token = token;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'الرمز غير صالح أو منتهي الصلاحية'
        });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'الوصول مقتصر على المديرين فقط'
        });
    }
    next();
};

const alumniMiddleware = (req, res, next) => {
    if (req.user.role !== 'ALUMNI' && req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'الوصول مقتصر على الخريجين فقط'
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware, alumniMiddleware };