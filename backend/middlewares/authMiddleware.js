const jwt = require('jsonwebtoken');
const db = require('../config/database');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Accès non autorisé. Token manquant.'
            });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user exists and is active
        const [rows] = await db.execute(
            'SELECT id_user, email, role FROM utilisateur WHERE id_user = ?',
            [decoded.userId]
        );

        if (rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non trouvé'
            });
        }

        req.user = rows[0];
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token invalide'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expiré'
            });
        }
        
        return res.status(500).json({
            success: false,
            message: 'Erreur d\'authentification'
        });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux administrateurs'
        });
    }
    next();
};

// Middleware to check if user is alumni
const isAlumni = (req, res, next) => {
    if (req.user.role !== 'ALUMNI') {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux anciens étudiants'
        });
    }
    next();
};

// Middleware to check if user is student
const isStudent = (req, res, next) => {
    if (req.user.role !== 'STUDENT') {
        return res.status(403).json({
            success: false,
            message: 'Accès réservé aux étudiants'
        });
    }
    next();
};

module.exports = {
    authMiddleware,
    isAdmin,
    isAlumni,
    isStudent
};