const express = require("express");
const router = express.Router();

const product = require("../controllers/product");


router.post("/", product.createProduct);


router.get("/search", product.getByNameQuery);


router.get("/name/:name", product.getByNameParam);


router.get("/:id", product.getById);


router.put("/:id", product.updateProduct);

router.delete("/:id", product.deleteProduct);

module.exports = router;