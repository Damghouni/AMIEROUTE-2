const express = require('express');
const router = express.Router();
const { 
  getOrders, 
  getOrder, 
  createOrder, 
  updateOrderStatus,
  assignDriver,
  rateOrder 
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { orderValidation } = require('../utils/validators');

router.use(protect);

router.route('/')
  .get(getOrders)
  .post(authorize('client'), orderValidation, createOrder);

router.route('/:id')
  .get(getOrder);

router.put('/:id/status', authorize('merchant', 'driver', 'admin'), updateOrderStatus);
router.put('/:id/assign-driver', authorize('admin'), assignDriver);
router.put('/:id/rate', authorize('client'), rateOrder);

module.exports = router;
