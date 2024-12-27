const assetCategoryController = require('../controllers/assetCategoryController');

const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Category routes
router.post('/assetcategory', assetCategoryController.create);  // Tạo danh mục tài sản
router.get('/assetcategory', assetCategoryController.show);  // Lấy tất cả danh mục tài sản


module.exports = router;