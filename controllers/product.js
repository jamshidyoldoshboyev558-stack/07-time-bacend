const sequelize = require('../config/database');
const { DataTypes, Op } = require('sequelize');
const defineProductModel = require('../models/product');
const productModel = defineProductModel(sequelize, DataTypes);

exports.createProduct = async (req, res) => {
 try{
  const { seller_id, name, description, price, images, stock_quantity, is_available, delivery_region } = req.body;

  const newProduct = await productModel.create({
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
    const id = Number(req.params.id);
    const product = await productModel.findByPk(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getByNameQuery = async (req, res) => {
  try {
    const { name } = req.query;

    const products = await productModel.findAll({
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

    const products = await productModel.findAll({
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

    const [updatedCount, updatedRows] = await productModel.update(
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
    const product = await productModel.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Topilmadi" });
    }

    await product.destroy();
    res.json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};