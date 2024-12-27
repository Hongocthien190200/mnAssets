const locationController = require('../controllers/locationController');

const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Location routes
router.post('/locations', locationController.create);  // Tạo khu vực mới
router.get('/locations', locationController.show);  // Lấy tất cả khu vực

module.exports = router;