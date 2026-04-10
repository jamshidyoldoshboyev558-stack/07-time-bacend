const router = require("express").Router();
const controller = require("../controller/Mastercontroller");
const auth = require("../middleware/AuthMiddleware");

router.get("/masters", controller.getMasters);
router.get("/masters/:id", controller.getMasterById);
router.put("/masters/profile", auth, controller.updateMasterProfile);
router.post("/masters/portfolio", auth, controller.addPortfolioImage);
router.get("/masters/orders", auth, controller.getMasterOrders);

module.exports = router;