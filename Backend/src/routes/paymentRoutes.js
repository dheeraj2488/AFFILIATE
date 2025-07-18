const express = require('express');
const router = express.Router();

const paymentController = require('../controller/paymentController');
const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');

router.post('/webhook', express.raw({ type: 'application/json' }),
    paymentController.handleWebhookEvent);

router.use(authMiddleware.protect);

router.post('/create-order', authorize('payment:create'), paymentController.createOrder);
router.post('/verify-order', authorize('payment:verify'), paymentController.verifyOrder);
router.post('/create-subscription', authorize('payment:create'), paymentController.createSubscription);
router.post('/verify-subscription', authorize('payment:create'), paymentController.verifySubscription);
router.post('/cancel-subscription', authorize('payment:create'), paymentController.cancelSubscription);
module.exports = router;