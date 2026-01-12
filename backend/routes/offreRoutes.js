const express = require('express');
const router = express.Router();
const offreController = require('../controllers/offreController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, offreController.create);
router.get('/', authMiddleware, offreController.getAll);
router.get('/:id', authMiddleware, offreController.getById);
router.put('/:id', authMiddleware, offreController.update);
router.delete('/:id', authMiddleware, offreController.delete);

module.exports = router;