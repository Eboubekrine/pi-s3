const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `cv-${Date.now()}${path.extname(file.originalname)}`)
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowed = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only PDF and Word documents are allowed'));
    }
});

router.post('/apply', authMiddleware, upload.single('cv'), candidatureController.apply);
router.get('/my', authMiddleware, candidatureController.getUserApplications);
router.get('/offre/:offreId', authMiddleware, adminMiddleware, candidatureController.getOffreApplications);
router.patch('/:id/status', authMiddleware, adminMiddleware, candidatureController.updateStatus);

module.exports = router;
