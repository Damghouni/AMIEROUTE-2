const { body } = require('express-validator');


// ===============================
// AUTH VALIDATION
// ===============================

const registerValidation = [

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),


  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),


  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),


  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^\+?[0-9\s()-]{8,20}$/)
    .withMessage('Please provide a valid phone number'),


  body('role')
    .optional()
    .isIn([
      'client',
      'merchant',
      'driver',
      'admin'
    ])
    .withMessage('Invalid role')

];





const loginValidation = [

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),


  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')

];




// ===============================
// STORE VALIDATION
// ===============================

const storeValidation = [

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Store name is required'),


  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),


  body('address.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),


  body('address.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),


  body('address.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),


  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')

];





// ===============================
// PRODUCT VALIDATION
// ===============================

const productValidation = [

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),


  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),


  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),


  body('store')
    .notEmpty()
    .withMessage('Store is required')

];





// ===============================
// ORDER VALIDATION
// ===============================

const orderValidation = [

  body('store')
    .notEmpty()
    .withMessage('Store is required'),


  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),


  body('items.*.product')
    .notEmpty()
    .withMessage('Product is required'),


  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),


  body('deliveryAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Delivery street is required'),


  body('deliveryAddress.city')
    .trim()
    .notEmpty()
    .withMessage('Delivery city is required'),


  body('deliveryAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Delivery postal code is required'),


  body('paymentMethod')
    .notEmpty()
    .withMessage('Payment method is required')

];





// ===============================
// EXPORTS
// ===============================

module.exports = {

  registerValidation,
  loginValidation,

  storeValidation,
  productValidation,
  orderValidation

};