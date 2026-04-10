module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    region: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "user" 
    }
  }, {
    timestamps: false
  });
};