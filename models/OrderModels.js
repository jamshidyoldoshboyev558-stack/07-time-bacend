module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Order", {
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    master_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    commission_rate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.10
    },
    commission_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    proof_images: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('proof_images');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('proof_images', JSON.stringify(value || []));
      }
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
  });
};