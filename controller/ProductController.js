const { Product } = require("../models");

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      seller_id: req.user.id,
      delivery_region: req.user.region
    });

    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: {
        delivery_region: req.region
      }
    });

    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product topilmadi" });

    if (product.seller_id !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await product.update(req.body);

    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product topilmadi" });

    if (product.seller_id !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await product.destroy();

    res.json({ message: "O‘chirildi" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};