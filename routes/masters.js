const express = require('express');
const router = express.Router();
const masterController = require('../controllers/Profile');
const authMiddleware = require('../middleware/auth');
const { cancelOrder } = require("../controllers/order");

router.get('/', masterController.getMasters);
router.get('/:id', masterController.getMasterById);
router.put("/cancel/:id", cancelOrder)
router.post('/portfolio', authMiddleware, masterController.addPortfolioImage);
router.put('/orders/:id/cancel', authMiddleware, cancelOrder);
router.get('/orders', authMiddleware, masterController.getMasterOrders);

module.exports = router;
