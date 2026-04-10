const router = require("express").Router();
const controller = require("../controller/OrderController");
const auth = require("../middleware/AuthMiddleware");

router.post("/orders", auth, controller.createOrder);
router.get("/orders/:id", controller.getOrderById);
router.put("/orders/:id/accept", auth, controller.acceptOrder);
router.put("/orders/:id/complete", auth, controller.completeOrder);
router.post("/orders/:id/review", auth, controller.reviewOrder);
router.delete("/orders/:id/cancel", auth, controller.cancelOrder);

module.exports = router;