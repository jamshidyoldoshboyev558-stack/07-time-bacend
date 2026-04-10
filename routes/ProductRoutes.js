const router = require("express").Router();
const auth = require("../middleware/AuthMiddleware");
const ProductController = require('../controller/ProductController');

const region = require("../middleware/RegionMiddleware");


router.post("/products", auth, ProductController.createProduct);
router.get("/products", auth, region, ProductController.getProducts);
router.put("/products/:id", auth, ProductController.updateProduct);
router.delete("/products/:id", auth, ProductController.deleteProduct);

module.exports = router;