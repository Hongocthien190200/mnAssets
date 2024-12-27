const transferAssetController = require('../controllers/transferAssetController');

// const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Asset routes
router.post('/transferasset', transferAssetController.create);  // Tạo mới nhiều hoặc một tài sản
// router.put('/assets/:id', assetController.update);  // Cập nhật tài sản
// router.get('/assets', assetController.show);  // Lấy tất cả tài sản

module.exports = router;