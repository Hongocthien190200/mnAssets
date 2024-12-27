const mongoose = require('mongoose');
const { Schema } = mongoose;
const MaintenanceReminderSchema = new mongoose.Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },  // Tài sản cần bảo dưỡng
    reminderDate: {
        type: Date,
        required: true
    },  // Ngày nhắc bảo dưỡng
    repeatInterval: {
        type: String,
        enum: ['monthly', 'bimonthly', 'yearly', 'custom'],
        required: true  // Chu kỳ lặp lại (nếu có)
    },
    customDate: {
        type: Date
    }  // Ngày lặp lại cụ thể (nếu chọn custom)
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
});


module.exports = mongoose.model('MaintenanceReminder', MaintenanceReminderSchema);