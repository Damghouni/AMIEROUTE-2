const express = require('express');
const router = express.Router();
const { 
  getStores, 
  getStore, 
  createStore, 
  updateStore, 
  deleteStore,
  getMyStores,
  getStoresByMerchant
} = require('../controllers/storeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const { storeValidation } = require('../utils/validators');

router.route('/')
  .get(getStores)
  .post(protect, authorize('merchant', 'admin'), storeValidation, createStore);

router.get('/my-stores', protect, authorize('merchant'), getMyStores);

// Important: Cette route doit être AVANT la route /:id
router.get('/merchant/:merchantId', protect, getStoresByMerchant);

router.route('/:id')
  .get(getStore)
  .put(protect, authorize('merchant', 'admin'), updateStore)
  .delete(protect, authorize('merchant', 'admin'), deleteStore);

module.exports = router;
