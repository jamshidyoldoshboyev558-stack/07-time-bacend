const Master = require('../models/masterProfile');

// GET /masters?region=&specialty=
exports.getMasters = async (req, res) => {
    try {
        const { region, specialty } = req.query;
        let query = { is_active: true }; // Faqat aktiv ustalarni chiqarish

        if (region) query.region = region;
        if (specialty) query.specialty = specialty;

        const masters = await Master.find(query).select('-password');
        res.status(200).json(masters);
    } catch (error) {
        res.status(500).json({ message: "Ustalarni yuklashda xatolik", error });
    }
};

// GET /masters/:id
exports.getMasterById = async (req, res) => {
    try {
        const master = await Master.findById(req.params.id).select('-password');
        if (!master) return res.status(404).json({ message: "Usta topilmadi" });
        
        res.status(200).json(master);
    } catch (error) {
        res.status(500).json({ message: "Server xatosi", error });
    }
};

// PUT /masters/profile
exports.updateProfile = async (req, res) => {
    try {
        // req.user.id - tokendan olingan usta ID si
        const updatedMaster = await Master.findByIdAndUpdate(
            req.user.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedMaster);
    } catch (error) {
        res.status(400).json({ message: "Profilni yangilashda xatolik", error });
    }
};

// POST /masters/portfolio
exports.uploadPortfolio = async (req, res) => {
    try {
        // Rasm yo'li (multer yoki shunga o'xshash middleware orqali)
        const imageUrl = req.file ? req.file.path : null;
        
        if (!imageUrl) return res.status(400).json({ message: "Rasm yuklanmadi" });

        const master = await Master.findById(req.user.id);
        master.portfolio.push(imageUrl);
        await master.save();

        res.status(201).json({ message: "Portfolio yangilandi", imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Rasm yuklashda xatolik", error });
    }
};