const express = require('express');
const router = express.Router();
const evenementController = require('../controllers/evenementController');
const { authMiddleware } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.post('/', authMiddleware, upload.single('image'), evenementController.create);
router.get('/', authMiddleware, evenementController.getAll);
router.get('/:id', authMiddleware, evenementController.getById);
router.put('/:id', authMiddleware, evenementController.update);
router.delete('/:id', authMiddleware, evenementController.delete);

module.exports = router;