const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ORDER_STATUS = [
    "pending",
    "accepted",
    "in_progress",
    "done",
    "cancelled"
];

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    client_id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    master_id: {
        type: DataTypes.UUID
    },

    description: {
        type: DataTypes.TEXT
    },

    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        validate: {
            isIn: [ORDER_STATUS]
        }
    },

    region: DataTypes.STRING(100),
    price: DataTypes.DECIMAL(12, 2),
    commission_rate: DataTypes.DECIMAL(4, 2),
    commission_amout: DataTypes.DECIMAL(12, 2),

    proof_images: {
        type: DataTypes.JSON
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.DATE.NOW
    },

    completed_at: DataTypes.DATE

}, {
    tableName: "orders",
    timestamps: false
})

module.exports = Order;