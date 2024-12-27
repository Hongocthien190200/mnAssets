const transferController = require('../controllers/transferController');

const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Transfer routes
router.post('/transfers', transferController.transferAsset);  // Luân phiên chuyển giao tài sản giữa các khu vực
router.get('/transfers', transferController.getAllTransfers);  // Lấy tất cả bản ghi chuyển giao

module.exports = router;