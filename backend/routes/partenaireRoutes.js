const express = require('express');
const router = express.Router();
const partenaireController = require('../controllers/partenaireController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, partenaireController.getAll);
router.post('/', authMiddleware, partenaireController.create);
router.put('/:id', authMiddleware, partenaireController.update);
router.delete('/:id', authMiddleware, partenaireController.delete);

module.exports = router;
