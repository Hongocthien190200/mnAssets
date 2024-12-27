const assetController = require('../controllers/assetController');

// const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Asset routes
router.post('/assets', assetController.create);  // Tạo mới nhiều hoặc một tài sản
router.put('/assets/:id', assetController.update);  // Cập nhật tài sản
router.get('/assets', assetController.show);  // Lấy tất cả tài sản
router.get('/assets/location/:id', assetController.showByIdLocation);  // Lấy tất cả tài sản
router.get('/assets/:idlocation/:idcategory', assetController.showByIdLocaAndCate);  // Lấy tất cả tài sản

module.exports = router;