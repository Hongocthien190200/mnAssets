const mongoose = require('mongoose');
const { Schema } = mongoose;
const TransferRecordSchema = new Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },  // Tài sản được chuyển
    fromLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },  // Từ Khu vực
    toLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },  // Đến Khu vực
    transferDate: {
        type: Date,
        required: true
    },  // Ngày chuyển giao
    notes: {
        type: String
    }  // Ghi chú (Optional)
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
});

module.exports = mongoose.model('TransferRecord', TransferRecordSchema);