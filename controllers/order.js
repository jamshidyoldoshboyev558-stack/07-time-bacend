const { DATE } = require("sequelize");
const Order = require("../models/order");

const STATUS = {
    PENDING: "pending",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in_progress",
    DONE: "done",
    CANCELLED: "cancelled"
};

// CREATE
exports.createOrder = async (req, res) => {
    const order = await Order.create({
        ...req.body,
        client_id: req.user.id
    });

    res.status(201).json(order);
};

// GET
exports.getOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Not found" });

    res.json(order)
};

// ACCEPT
exports.acceptedOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order.status !== STATUS.PENDING) {
        return res.status(400).json({ message: "Already taken" });
    }

    order.status = STATUS.ACCEPTED;
    order.master_id = req.user.id;

    await order.save();
    res.json(order);
};

// COMPLETE 
exports.completeOrder = async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (
        order.status !== STATUS.ACCEPTED && 
        order.status !== STATUS.IN_PROGRESS
    ) {
        return res.status(400).json({ message: "Cannot complete" });
    }

    order.status = STATUS.DONE;
    order.proof_images = req.body.proof_images;
    order.completed_at = new DATE();

    if (order.price && order.commission_rate) {
        order.commission_amount = 
        (order.price * order.commission_rate) / 100;
    }

    await order.save();
    res.json(order);
};

// REVIEW 
exports.reviewOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  order.rating = req.body.rating;

  await order.save();
  res.json(order);
};

// CANCEL
exports.cancelOrder = async (req, res) => {
  const order = await Order.findByPk(req.params.id);

  if (order.status === STATUS.DONE) {
    return res.status(400).json({ message: "Already completed" });
  }

  order.status = STATUS.CANCELLED;
  await order.save();

  res.json(order);
};