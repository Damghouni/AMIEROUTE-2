const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const storeRoutes = require('./stores');
const productRoutes = require('./products');
const orderRoutes = require('./orders');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/stores', storeRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);

module.exports = router;
