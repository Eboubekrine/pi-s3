const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, userController.getAll);
router.get('/:id', authMiddleware, userController.getById);
router.put('/:id/validate', authMiddleware, adminMiddleware, userController.validateUser);
router.delete('/:id', authMiddleware, userController.delete);

module.exports = router;