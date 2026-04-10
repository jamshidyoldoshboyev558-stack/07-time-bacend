const { Master, Order, User } = require("../models");

exports.getMasters = async (req, res) => {
  try {
    const { region, specialty } = req.query;
    const whereClause = {};
    
    if (region) whereClause.region = region;
    if (specialty) whereClause.specialty = specialty;
    
    const masters = await Master.findAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['name', 'region']
      }]
    });

    res.json(masters);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMasterById = async (req, res) => {
  try {
    const master = await Master.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['name', 'region']
      }]
    });

    if (!master) {
      return res.status(404).json({ message: "Usta topilmadi" });
    }

    res.json(master);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.updateMasterProfile = async (req, res) => {
  try {
    const master = await Master.findOne({
      where: { user_id: req.user.id }
    });

    if (!master) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const updatedMaster = await master.update(req.body);
    res.json(updatedMaster);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addPortfolioImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    const master = await Master.findOne({
      where: { user_id: req.user.id }
    });

    if (!master) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const portfolioImages = master.portfolio_images || [];
    portfolioImages.push(imageUrl);

    await master.update({ portfolio_images: portfolioImages });
    res.json(master);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getMasterOrders = async (req, res) => {
  try {
    const master = await Master.findOne({
      where: { user_id: req.user.id }
    });

    if (!master) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const orders = await Order.findAll({
      where: { master_id: master.id },
      include: [{
        model: User,
        as: 'client',
        attributes: ['name', 'region']
      }]
    });

    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
