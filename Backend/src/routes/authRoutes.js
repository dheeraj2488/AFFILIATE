const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const {body} = require('express-validator');

const loginValidator = [
    body('username').notEmpty().withMessage('Username is required')
    .isEmail().withMessage('Username must be a valid email'),

    body('password').notEmpty().withMessage('Password is required')
    .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
];
  

router.post('/login' ,loginValidator, authController.login);
router.post('/logout' , authController.logout);
router.get('/isUserLoggedIn', authController.isUserLoggedIn);
router.post('/register' ,loginValidator ,  authController.register);
router.post('/google-auth', authController.googleAuth);
router.post('/refresh-token', authController.refreshToken);
module.exports = router;