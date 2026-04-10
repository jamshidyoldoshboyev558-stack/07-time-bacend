const { Order, Master, User } = require("../models");

exports.createOrder = async (req, res) => {
  try {
    const { master_id, description, price, region } = req.body;
    
    const master = await Master.findByPk(master_id);
    if (!master) {
      return res.status(404).json({ message: "Usta topilmadi" });
    }

    const commission_rate = 0.10;
    const commission_amount = price * commission_rate;

    const order = await Order.create({
      client_id: req.user.id,
      master_id,
      description,
      region: region || req.user.region,
      price,
      commission_rate,
      commission_amount,
      status: 'pending'
    });

    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['name', 'region']
        },
        {
          model: Master,
          include: [{
            model: User,
            attributes: ['name', 'region']
          }]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.acceptOrder = async (req, res) => {
  try {
    const master = await Master.findOne({
      where: { user_id: req.user.id }
    });

    if (!master) {
      return res.status(404).json({ message: "Usta profili topilmadi" });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    if (order.master_id !== master.id) {
      return res.status(403).json({ message: "Bu buyurtma sizga tegishli emas" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: "Buyurtma allaqachon qabul qilingan yoki bekor qilingan" });
    }

    await order.update({ status: 'accepted' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.completeOrder = async (req, res) => {
  try {
    const { proof_images } = req.body;
    
    const master = await Master.findOne({
      where: { user_id: req.user.id }
    });

    if (!master) {
      return res.status(404).json({ message: "Usta profili topilmadi" });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    if (order.master_id !== master.id) {
      return res.status(403).json({ message: "Bu buyurtma sizga tegishli emas" });
    }

    if (order.status !== 'accepted') {
      return res.status(400).json({ message: "Buyurtma avval qabul qilinishi kerak" });
    }

    await order.update({
      status: 'completed',
      proof_images: proof_images || [],
      completed_at: new Date()
    });

    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.reviewOrder = async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    if (order.client_id !== req.user.id) {
      return res.status(403).json({ message: "Bu buyurtma sizga tegishli emas" });
    }

    if (order.status !== 'completed') {
      return res.status(400).json({ message: "Faqat tugallangan buyurtmalarni baholash mumkin" });
    }

    const master = await Master.findByPk(order.master_id);
    
    const newTotalReviews = master.total_reviews + 1;
    const newRating = ((master.rating * master.total_reviews) + rating) / newTotalReviews;

    await master.update({
      rating: newRating,
      total_reviews: newTotalReviews
    });

    res.json({ message: "Baholash muvaffaqiyatli qo'shildi", master });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    if (order.client_id !== req.user.id) {
      return res.status(403).json({ message: "Bu buyurtma sizga tegishli emas" });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ message: "Faqat kutayotgan buyurtmalarni bekor qilish mumkin" });
    }

    await order.update({ status: 'cancelled' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};