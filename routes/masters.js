const express = require('express');
const router = express.Router();
const masterController = require('../controllers/Profile');
const { protect } = require('../middleware/auth'); // Avtorizatsiya uchun
const upload = require('../middleware/region'); // Rasm yuklash uchun (multer)

// Ommaviy route-lar (hamma ko'ra oladi)
router.get('/', masterController.getMasters);
router.get('/:id', masterController.getMasterById);

// Himoyalangan route-lar (faqat tizimga kirgan ustalar uchun)
router.put('/profile', protect, masterController.updateProfile);
router.post('/portfolio', protect, upload.single('image'), masterController.uploadPortfolio);

module.exports = router;