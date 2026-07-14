const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Store = require('../models/Store');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { store, category, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

    const query = { isAvailable: true };
    if (store) query.store = store;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.find(query)
      .populate('store', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('store', 'name address phone');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by merchant
// @route   GET /api/products/merchant/:merchantId
// @access  Private
const getProductsByMerchant = async (req, res, next) => {
  try {
    const { merchantId } = req.params;

    // Find all stores owned by this merchant
    const stores = await Store.find({ owner: merchantId });
    const storeIds = stores.map(store => store._id);

    // Find all products in these stores
    const products = await Product.find({ store: { $in: storeIds } })
      .populate('store', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by store
// @route   GET /api/products/store/:storeId
// @access  Public
const getProductsByStore = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      store: req.params.storeId,
    }).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Merchant
const createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Verify store ownership
    const store = await Store.findById(req.body.store);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    if (store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add products to this store'
      });
    }

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Merchant
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id).populate('store', 'owner');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Merchant
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('store', 'owner');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.store.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  getProductsByMerchant,
  getProductsByStore,
  createProduct,
  updateProduct,
  deleteProduct
};