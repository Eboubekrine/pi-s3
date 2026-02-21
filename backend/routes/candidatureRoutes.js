const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// No multer on apply — file upload is not supported on cloud deployments.
// CV is passed as a URL string, not a file upload.
router.post('/apply', authMiddleware, candidatureController.apply);
router.get('/my', authMiddleware, candidatureController.getUserApplications);
router.get('/offre/:offreId', authMiddleware, adminMiddleware, candidatureController.getOffreApplications);
router.patch('/:id/status', authMiddleware, adminMiddleware, candidatureController.updateStatus);

module.exports = router;
