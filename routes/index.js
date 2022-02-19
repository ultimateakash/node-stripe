const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validator');
const paymentController = require('../controllers/payment.controller');
 
 
router.get('/',                              paymentController.index);
router.post('/payment', validate('payment'), paymentController.payment);

module.exports = router;
