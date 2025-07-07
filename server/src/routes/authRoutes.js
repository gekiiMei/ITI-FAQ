const authController = require('../controllers/authController');
const express = require('express')
const router = express.Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/refresh', authController.refresh);
router.get('/remove-refresh', authController.remove_refresh);

module.exports = router;