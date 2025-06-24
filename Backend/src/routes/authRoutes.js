const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/login' , authController.login);
router.post('/logout' , authController.logout);
router.get('/isUserLoggedIn', authController.isUserLoggedIn);
router.post('/register' , authController.register);

module.exports = router;