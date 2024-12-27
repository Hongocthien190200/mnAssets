const reminderController = require('../controllers/reminderController');

const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

// Reminder routes
router.post('/reminders', reminderController.create);  // Tạo lịch nhắc bảo dưỡng
router.put('/reminders/:id', reminderController.update);  // Sửa lịch nhắc
router.delete('/reminders/:id', reminderController.delete);  // Xóa lịch nhắc
router.get('/reminders', reminderController.show);  // Lấy tất cả lịch nhắc

module.exports = router;