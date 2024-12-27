const maintenanceController = require('../controllers/maintenanceController');

const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Maintenance routes
router.post('/maintenance', maintenanceController.create);  // Tạo phiếu bảo dưỡng/sửa chữa
router.get('/maintenance', maintenanceController.show);  // Lấy tất cả phiếu bảo dưỡng/sửa chữa

module.exports = router;