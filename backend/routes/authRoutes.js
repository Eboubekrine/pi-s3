const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), authController.updateProfile);

module.exports = router;
