const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProduct, 
  getProductsByMerchant,
  getProductsByStore,
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { productValidation } = require('../utils/validators');

router.route('/')
  .get(getProducts)
  .post(protect, authorize('merchant', 'admin'), productValidation, createProduct);

router.get('/merchant/:merchantId', protect, getProductsByMerchant);
router.get('/store/:storeId', getProductsByStore);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('merchant', 'admin'), updateProduct)
  .delete(protect, authorize('merchant', 'admin'), deleteProduct);

module.exports = router;
