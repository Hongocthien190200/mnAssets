const mongoose = require('mongoose');
const { Schema } = mongoose;
const MaintenanceRecordSchema = new Schema({
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },  // Tài sản bảo dưỡng/sửa chữa
    reason: {
        type: String,
        required: true
    },  // Lý do bảo dưỡng/sửa chữa
    actionsTaken: {
        type: String,
        required: true
    },  // Đã thực hiện những gì
    cost: {
        type: Number,
        required: true
    },  // Thành tiền
    serviceProvider: {
        name: {
            type: String,
            required: true
        },  // Tên đơn vị sửa chữa/bảo dưỡng
        phone: {
            type: String,
            required: true
        },  // Số điện thoại liên hệ
        email: {
            type: String
        },  // Email (Optional)
        address: {
            type: String
        }  // Địa chỉ (Optional)
    },
    maintenanceDate: {
        type: Date,
        required: true
    }  // Ngày bảo dưỡng/sửa chữa
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
});


module.exports = mongoose.model('MaintenanceRecord', MaintenanceRecordSchema);