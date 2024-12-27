const mongoose = require('mongoose');
const { Schema } = mongoose;

const AssetSchema = new Schema({
    assetCode: {
        type: String,
        required: true,
        unique: true
    },  // Mã tài sản
    name: {
        type: String,
        required: true
    },  // Tên tài sản
    quantity: {
        type: String,
        required: true
    },  // Số lượng
    unit: {
        type: String,
        required: true
    },  // Đơn vị tính (chiếc, cái, bộ, ...)
    yearOfProduction: {
        type: String,
        required: true
    },  // Năm sản xuất
    yearOfUse: {
        type: String,
        required: true
    },  // Năm sử dụng
    image: { type: String },  // Hình ảnh (URL)
    status: {
        type: String,
        enum: ['in_use', 'liquidated', 'damaged'],
        required: true,
        default: 'in_use' // Correct key for default value
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssetCategory',
        required: true  // 
    },
    model: {
        type: String
    },  // Mẫu mã (Optional)
    serialNumber: {
        type: String
    },  // Seri (Optional)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },  // Người sử dụng (Optional)
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true

    },  // Nơi sử dụng (Reference to Location)
    price: {
        type: String
    },  // Giá (Optional)
    description: [
        {
            type: String
        }
    ],  // Mô tả (Optional)
    notes: [
        {
            type: String
        }
    ],  // Ghi chú (Optional)
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
});
module.exports = mongoose.model('Asset', AssetSchema);