const TransferAsset = require('../Models/TransferAsset');

const multer = require("multer");
const fs = require('fs');
const path = require('path');

// Helper function để đảm bảo các thư mục tồn tại
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

ensureDirectoryExists(path.join(__dirname, '../uploads/signassets'));

// Cấu hình lưu trữ cho hình ảnh của chữ ký
const storageSignature = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, path.join(__dirname, '../uploads/signassets'));
        } else {
            cb(new Error('Invalid fieldname for signature upload'), false);
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
// File filter để kiểm tra loại tệp tin hợp lệ
const fileFilterAssets = (req, file, cb) => {
    if (file.fieldname === 'image') {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('File không hợp lệ cho hình ảnh.'), false);
        }
    } else {
        cb(new Error('Invalid fieldname'), false);
    }
};

// Khởi tạo các đối tượng multer cho chữ ký
const uploadSignature = multer({
    storage: storageSignature,
    fileFilter: fileFilterAssets
});

// Helper function để chạy multer upload trong một promise
const runMulterUpload = (upload, req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

const assetController = {
    create: async (req, res) => {
        try {
            await runMulterUpload(uploadSignature.fields([
                { name: 'partyASignature', maxCount: 1 }
            ]), req, res);

            // Get paths of uploaded signatures
            const partyASignaturePath = req.files['partyASignature'] ? `${req.files['partyASignature'][0].filename}` : null;

            const { content, partyA, partyB } = req.body;

            // Validation for required fields
            if (!content || !partyA || !partyB) {
                // Delete uploaded files if required fields are missing
                if (partyASignaturePath) fs.unlinkSync(path.join(__dirname, `../uploads/signatures/${partyASignaturePath}`));
                return res.status(400).json({ message: 'Missing required fields.' });
            }

            // Parse the content field to ensure it's in object format
            const parsedContent = JSON.parse(content);

            // Create a new transfer asset record
            const newTransferRecord = new TransferAsset({
                content: parsedContent,
                partyA,
                partyASignature: partyASignaturePath ? partyASignaturePath : null,
                partyB,
            });

            // Save the new transfer record
            await newTransferRecord.save();

            res.status(201).json({ message: 'Transfer record created successfully.', transferRecord: newTransferRecord });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Failed to create transfer record.', error: err.message });
        }
    }

}
module.exports = assetController;
