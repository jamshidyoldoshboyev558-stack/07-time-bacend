const { Product } = require('../models');
const { DataTypes, Op } = require('sequelize');

exports.createProduct = async (req, res) => {
 try{
  const { seller_id, name, description, price, images, stock_quantity, is_available, delivery_region } = req.body;

  const newProduct = await Product.create({
    seller_id,
    name,
    description,
    price,
    images,
    stock_quantity,
    is_available,
    delivery_region
  });

  res.status(201).json(newProduct);

 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};


exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findByPk(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getByNameQuery = async (req, res) => {
  try {
    const { name } = req.query;

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getByNameParam = async (req, res) => {
  try {
    const name = req.params.name;

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`
        }
      }
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, images, stock_quantity, is_available, delivery_region } = req.body;

    const [updatedCount, updatedRows] = await Product.update(
      {
        name,
        description,
        price,
        images,
        stock_quantity,
        is_available,
        delivery_region
      },
      {
        where: { id },
        returning: true
      }
    );

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    res.json(updatedRows[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    await product.destroy();
    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};