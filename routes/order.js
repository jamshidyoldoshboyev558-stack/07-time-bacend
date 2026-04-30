const express = require('express');
const router = express.Router();

const orderController = require("../controllers/order");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const role = require('../middleware/role');

router.use(authMiddleware);

router.post(
  "/", 
  roleMiddleware("mijoz"),
  orderController.createOrder
);

router.get(
  "/:id",
  roleMiddleware("mijoz", "usta"),
  orderController.getOrder
);

router.put(
  "/:id/accept",
  roleMiddleware("usta"),
  orderController.acceptedOrder
);

router.put(
  "/:id/complete",
  roleMiddleware("usta"),
  orderController.completeOrder
);

router.post(
  "/:id/review",
  roleMiddleware("mijoz"),
  orderController.reviewOrder
);

router.delete(
  "/:id/cancel",
  roleMiddleware("mijoz"),
  orderController.cancelOrder
);

module.exports = router;
