const AssetCategory = require('../Models/AssetCategory');
const assetCategoryController = {

    show: async (req, res) => {
        try {
            const categories = await AssetCategory.find();
            res.status(200).json(categories);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get categories', error: err.message });
        }
    },
    create: async (req, res) => {
        try {
            const { name, code } = await req.body;
            if (!name || !code) {
                return res.status(400).json({ message: 'Thiếu các trường bắt buộc.' });
            }
            const category = new AssetCategory(req.body);
            await category.save();
            res.status(201).json(category);
        } catch (err) {
            res.status(400).json({ message: 'Failed to create category', error: err.message });
        }
    },

}
module.exports = assetCategoryController;
