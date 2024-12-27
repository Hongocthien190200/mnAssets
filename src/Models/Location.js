const mongoose = require('mongoose');
const { Schema } = mongoose;

const LocationSchema = new Schema({
    name: {
        type: String,
        required: true
    },  // Khu vực (e.g., Hồ Chí Minh, An Giang)
    address: {
        type: String
    },  // Địa chỉ chi tiết nếu cần
    code: {
        type: String,
        required: true
    } // mã khu vực (ví dụ: 59, 63, 72)
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
});

module.exports = mongoose.model('Location', LocationSchema);