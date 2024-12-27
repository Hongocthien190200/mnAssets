const Asset = require('../Models/Asset');
const Location = require('../Models/Location');
const AssetCategory = require('../Models/AssetCategory');

const multer = require("multer");
const fs = require('fs');
const path = require('path');

// Helper function để đảm bảo các thư mục tồn tại
const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Đảm bảo tất cả các thư mục cần thiết tồn tại
ensureDirectoryExists(path.join(__dirname, '../uploads/assets'));

// Cấu hình lưu trữ cho hình ảnh của tài sản
const storageAssets = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, path.join(__dirname, '../uploads/assets'));
        } else {
            cb(new Error('Invalid fieldname for assets upload'), false);
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

// Khởi tạo các đối tượng multer cho tài sản
const uploadAssets = multer({
    storage: storageAssets,
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

//Function đếm ký tự và chuyển đổi mã tài sản
const formatCode = (number) => {
    if (number < 10) {
        // Nếu chỉ có 1 chữ số thì thêm '00' vào trước
        return '00' + number.toString();
    } else if (number < 100) {
        // Nếu có 2 chữ số thì thêm '0' vào trước
        return '0' + number.toString();
    } else {
        // Nếu có 3 chữ số trở lên thì chỉ chuyển đổi thành string
        return number.toString();
    }
};
const assetController = {
    show: async (req, res) => {
        try {
            const assets = await Asset.find().populate('location');
            const updatedAssets = assets.map(asset => {
                // Thay thế image với đường dẫn đầy đủ
                const fullImagePath = `${req.protocol}://${req.get("host")}/uploads/assets/${asset.image}`;
                return {
                    ...asset._doc,
                    imagePath: fullImagePath,

                };
            });
            res.status(200).json(updatedAssets);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get assets', error: err.message });
        }
    },
    showByIdLocation: async (req, res) => {
        try {
            const locationId = req.params.id;  // Lấy id location từ params

            // Tìm tất cả các tài sản có location trùng với locationId
            const assets = await Asset.find({ location: locationId }).populate('location');

            // Cập nhật đường dẫn đầy đủ cho ảnh
            const updatedAssets = assets.map(asset => {
                const fullImagePath = `${req.protocol}://${req.get("host")}/uploads/assets/${asset.image}`;
                return {
                    ...asset._doc,
                    imagePath: fullImagePath,
                };
            });

            // Trả về kết quả
            res.status(200).json(updatedAssets);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get assets for the location', error: err.message });
        }
    },
    showByIdLocaAndCate: async (req, res) => {
        try {
            const locationId = req.params.idlocation;  // Lấy id location từ params
            const categoryId = req.params.idcategory;
            // Tìm tất cả các tài sản có location trùng với locationId
            let assets;
            if (categoryId === 'all') {
                assets = await Asset.find({ location: locationId }).populate('location');
            }
            else {
                assets = await Asset.find({ location: locationId }).populate('location').find({ category: categoryId }).populate('category');
                // assets = await Asset.find({ category: categoryId }).populate('category');
            }
            // Cập nhật đường dẫn đầy đủ cho ảnh
            const updatedAssets = assets.map(asset => {
                const fullImagePath = `${req.protocol}://${req.get("host")}/uploads/assets/${asset.image}`;
                return {
                    ...asset._doc,
                    imagePath: fullImagePath,
                };
            });

            // Trả về kết quả
            res.status(200).json(updatedAssets);
        } catch (err) {
            res.status(400).json({ message: 'Failed to get assets for the location', error: err.message });
        }
    },
    create: async (req, res) => {
        try {
            await runMulterUpload(uploadAssets.fields([
                { name: 'image', maxCount: 1 }
            ]), req, res);
            // Lấy đường dẫn các file đã upload
            imagePath = req.files['image'] ? `${req.files['image'][0].filename}` : null;
            if (!imagePath) {
                return res.status(400).json({ message: 'Thiếu hình ảnh.' });
            }
            const { name, quantity, unit, yearOfProduction, yearOfUse, model, serialNumber, location, category, price, description, notes } = await req.body;
            if (!name || !quantity || !unit || !yearOfProduction || !yearOfUse || !category) {
                if (imagePath) {
                    fs.unlink(path.join(__dirname, `../uploads/assets/${imagePath}`), (err) => {
                        if (err) {
                            console.error('Failed to delete uploaded image', err);
                        } else {
                            console.log('Uploaded image deleted due to missing required fields');
                        }
                    });
                }
                return res.status(400).json({ message: 'Thiếu các trường bắt buộc.' });
            }
            const assetWithCategory = (await Asset.find({ category: category }).populate('category')).length + 1;
            const newassetCode = `${(await Location.findById(location)).code}-${(await AssetCategory.findById(category)).code}-${yearOfUse.slice(-2)}-${await formatCode(assetWithCategory)}`

            const descriptionArray = description ? description.split('\n') : undefined;
            const newAsset = new Asset({
                assetCode: newassetCode,
                name,
                quantity,
                unit,
                yearOfProduction,
                yearOfUse,
                image: imagePath,
                model: model || undefined,
                serialNumber: serialNumber || undefined,
                location: location,
                category: category,
                price: price,
                description: descriptionArray,
                notes: notes || undefined
            });
            await newAsset.save();
            res.status(201).json(newAsset);
        } catch (err) {
            if (imagePath) {
                fs.unlink(path.join(__dirname, `../uploads/assets/${imagePath}`), (err) => {
                    if (err) {
                        console.error('Failed to delete uploaded image', err);
                    } else {
                        console.log('Uploaded image deleted due to missing required fields');
                    }
                });
            }
            res.status(400).json({ message: 'Failed to create assets', error: err.message });
        }
    },

    update: async (req, res) => {
        let newImagePath = null;
        try {
            // Sử dụng multer để upload hình ảnh mới (nếu có)
            await runMulterUpload(uploadAssets.fields([
                { name: 'image', maxCount: 1 }
            ]), req, res);

            // Kiểm tra xem có file ảnh mới được tải lên không
            newImagePath = req.files['image'] ? `${req.files['image'][0].filename}` : null;

            // Tìm asset hiện tại trong cơ sở dữ liệu
            const asset = await Asset.findById(req.params.id);
            if (!asset) return res.status(404).json({ message: 'Asset not found' });

            // Nếu có ảnh mới được tải lên, xóa ảnh cũ
            if (newImagePath && asset.image) {
                const oldImagePath = path.join(__dirname, `../uploads/assets/${asset.image}`);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Failed to delete old image:', err);
                    } else {
                        console.log('Old image deleted:', oldImagePath);
                    }
                });
            }
            // const {description} = req.body;
            // console.log(Array.isArray(description));
            // const descriptionArray = description ? description.split('\n') : undefined;
            // Cập nhật dữ liệu asset, bao gồm ảnh mới nếu có
            const updatedData = {
                ...req.body,
                image: newImagePath || asset.image // Nếu không có ảnh mới, giữ nguyên ảnh cũ
            };

            const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, updatedData, { new: true });
            // Trả về asset đã được cập nhật
            res.status(200).json(updatedAsset);

        } catch (err) {
            // Nếu có lỗi và có tệp ảnh mới được upload, xóa ảnh mới
            if (newImagePath) {
                fs.unlink(path.join(__dirname, `../uploads/assets/${newImagePath}`), (err) => {
                    if (err) {
                        console.error('Failed to delete newly uploaded image:', err);
                    } else {
                        console.log('Newly uploaded image deleted due to error:', newImagePath);
                    }
                });
            }
            res.status(400).json({ message: 'Failed to update asset', error: err.message });
        }
    },

}
module.exports = assetController;
