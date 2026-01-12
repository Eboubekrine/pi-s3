const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authMiddleware, adminMiddleware } = require('../middlewares/auth.middleware');

// الحصول على جميع المستخدمين (للمديرين فقط)
router.get('/', authMiddleware, adminMiddleware, UserController.getAllUsers);

// الحصول على مستخدم معين
router.get('/:id', authMiddleware, UserController.getUserById);

// تحديث المستخدم
router.put('/:id', authMiddleware, UserController.updateUser);

// حذف المستخدم (للمديرين فقط)
router.delete('/:id', authMiddleware, adminMiddleware, UserController.deleteUser);

// البحث عن المستخدمين
router.get('/search/:query', authMiddleware, UserController.searchUsers);

module.exports = router;