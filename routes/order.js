const express = require('express');
const router = express.Router();

const orderController = require("../controllers/order");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const role = require('../middleware/role');

router.use(authMiddleware);

router.post(
  "/orders", 
  roleMiddleware("mijoz"),
  orderController.createOrder
);

router.get(
  "/orders/:id",
  roleMiddleware("mijoz", "usta"),
  orderController.getOrder
);

router.put(
  "orders/:id/accept",
  roleMiddleware("usta"),
  orderController.acceptedOrder
);

router.put(
  "/orders/:id/complete",
  roleMiddleware("usta"),
  orderController.completeOrder
);

router.post(
  "/orders/:id/review",
  roleMiddleware("mijoz"),
  orderController.reviewOrder
);

router.delete(
  "/orders/:id/cancel",
  roleMiddleware("mijoz"),
  orderController.cancelOrder
);

module.exports = router;
