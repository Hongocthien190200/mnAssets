const mongoose = require('mongoose');
const { Schema } = mongoose;
const AssetCategorySchema = new Schema({
    name: {
        type: String,
    },
    code:{
        type: String,
        unique: true
    }
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
});

module.exports = mongoose.model('AssetCategory', AssetCategorySchema);