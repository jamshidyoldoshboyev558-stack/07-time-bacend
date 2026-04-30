const MasterModels = {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    total_orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_completed_orders: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_cancelled_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0 
    }
    };