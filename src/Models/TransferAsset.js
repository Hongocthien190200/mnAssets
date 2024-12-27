const mongoose = require('mongoose');
const { Schema } = mongoose;
const TransferAssetSchema = new Schema({
    content: [
        {
            asset: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Asset',
                required: true  // 
            },
            status: [
                {
                    type: String,
                    required: true
                }
            ],
        }
    ]
    ,
    partyA: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    partyASignature: {
        type: String // Chữ ký bên A (có thể lưu trữ dưới dạng URL của ảnh chữ ký)
    },
    partyB: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    partyBSignature: {
        type: String // Chữ ký bên B (có thể lưu trữ dưới dạng URL của ảnh chữ ký)
    },
    isDone: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: {
        currentTime: () => new Date(Date.now() + 7 * 60 * 60 * 1000) // Đặt múi giờ +7
    }
},); // Không tạo ID cho từng bản ghi trong mảng

module.exports = mongoose.model('TransferAsset', TransferAssetSchema);