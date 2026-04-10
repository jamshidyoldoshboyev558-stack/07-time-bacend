module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Product", {
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    images: DataTypes.ARRAY(DataTypes.TEXT),
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    delivery_region: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  });
};

