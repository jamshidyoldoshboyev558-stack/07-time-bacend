const { MasterProfile } = require('../models');

exports.getMasters = async (req, res) => {
    try {
        const { region, specialty } = req.query;
        let whereClause = { is_available: true }; 

        if (region) whereClause.region = region;
        if (specialty) whereClause.specialty = specialty;

        const masters = await MasterProfile.findAll({
            where: whereClause,
            attributes: { exclude: ['password_hash'] }
        });
        res.status(200).json(masters);
    } catch (error) {
        res.status(500).json({ message: "Ustalarni yuklashda xatolik", error });
    }
};

exports.getMasterById = async (req, res) => {
    try {
        const master = await MasterProfile.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!master) return res.status(404).json({ message: "Usta topilmadi" });
        
        res.status(200).json(master);
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updatedMaster = await MasterProfile.update(
            req.body,
            { 
                where: { user_id: req.user.id },
                returning: true
            }
        );
        res.status(200).json(updatedMaster[1][0]);
    } catch (error) {
        res.status(400).json({ message: "Profilni yangilashda xatolik", error });
    }
};

exports.addPortfolioImage = async (req, res) => {
    try {
        const imageUrl = req.file ? req.file.path : null;
        
        if (!imageUrl) return res.status(400).json({ message: "Rasm yuklanmadi" });

        const master = await MasterProfile.findOne({ where: { user_id: req.user.id } });
        if (!master) return res.status(404).json({ message: "Usta topilmadi" });

        const currentImages = master.portfolio_images || [];
        currentImages.push(imageUrl);
        
        await master.update({ portfolio_images: currentImages });

        res.status(201).json({ message: "Portfolio yangilandi", imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Rasm yuklashda xatolik", error });
    }
};

exports.getMasterOrders = async (req, res) => {
    try {
        const { Order } = require('../models');
        const orders = await Order.findAll({
            where: { master_id: req.user.id },
            order: [['created_at', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Buyurtmalarni yuklashda xatolik", error });
    }
};