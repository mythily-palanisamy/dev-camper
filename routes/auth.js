const express = require('express');
const { register } = require('../controllers/auth');
const router = express.Router();
const { login } = require('../controllers/auth');
const { getMe, protect } = require('../middleware/auth');

router
    .route('/register')
    .post(register);
router
    .route('/login')
    .post(login);

router.get('/me', protect, getMe);
module.exports = router;