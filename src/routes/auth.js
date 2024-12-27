const authController = require('../controllers/authController');
const midleware = require('../midleware/midlewareController');

const router = require('express').Router();

router.get("/alluser", authController.show);
router.post("/register", authController.registerUser);
router.patch("/secretkey/:id", authController.secretkeyUser);
router.patch("/acceptkey", authController.acceptkeyUser);
router.patch("/changepw", midleware.verifyTokenAndAdminAuth, authController.changePassword);
router.post("/login", authController.loginUser);
router.post("/logout", midleware.verifyToken, authController.logoutUser);
router.post("/refresh", authController.requestRefreshToken);
router.delete('/users/:id',midleware.verifyTokenAndAdminAuth, authController.deleteUser);

module.exports = router;