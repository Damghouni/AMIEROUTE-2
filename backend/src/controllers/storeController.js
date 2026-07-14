const { validationResult } = require('express-validator');
const Store = require('../models/Store');
const User = require('../models/User');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Public
const getStores = async (req, res, next) => {
  try {
    const { category, city, search, page = 1, limit = 10 } = req.query;

    const query = { isActive: true };
    if (category) query.category = category;
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (search) query.name = new RegExp(search, 'i');

    const stores = await Store.find(query)
      .populate('category', 'name')
      .populate('owner', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ 'rating.average': -1 });

    const total = await Store.countDocuments(query);

    res.json({
      success: true,
      data: stores,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single store
// @route   GET /api/stores/:id
// @access  Public
const getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id)
      .populate('category', 'name')
      .populate('owner', 'name email phone');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create store
// @route   POST /api/stores
// @access  Private/Merchant
const createStore = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    req.body.owner = req.user._id;
    const store = await Store.create(req.body);

    // Update user with the new storeId
    await User.findByIdAndUpdate(req.user._id, { storeId: store._id });

    res.status(201).json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update store
// @route   PUT /api/stores/:id
// @access  Private/Merchant/Admin
const updateStore = async (req, res, next) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check ownership or admin
    if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this store'
      });
    }

    store = await Store.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: store
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete store
// @route   DELETE /api/stores/:id
// @access  Private/Merchant/Admin
const deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Check ownership or admin
    if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this store'
      });
    }

    await store.deleteOne();

    res.json({
      success: true,
      message: 'Store deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get merchant's stores
// @route   GET /api/stores/my-stores
// @access  Private/Merchant
const getMyStores = async (req, res, next) => {
  try {
    const stores = await Store.find({ owner: req.user._id })
      .populate('category', 'name');

    res.json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stores by merchant ID
// @route   GET /api/stores/merchant/:merchantId
// @access  Private
const getStoresByMerchant = async (req, res, next) => {
  try {
    const { merchantId } = req.params;

    const stores = await Store.find({ owner: merchantId })
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
  getMyStores,
  getStoresByMerchant
};