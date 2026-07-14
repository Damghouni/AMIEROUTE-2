const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidation, loginValidation } = require('../utils/validators');

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

module.exports = router;
