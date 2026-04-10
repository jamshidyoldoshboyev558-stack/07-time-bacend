module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Master", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.00
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    portfolio_images: {
      type: DataTypes.TEXT,
      get() {
        const value = this.getDataValue('portfolio_images');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('portfolio_images', JSON.stringify(value || []));
      }
    },
    bio: {
      type: DataTypes.TEXT
    },
    is_available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: false
  });
};