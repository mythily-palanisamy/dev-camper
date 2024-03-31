const express = require('express');
const { register } = require('../controllers/auth');
const router = express.Router();
const { login } = require('../controllers/auth');

router
    .route('/register')
    .post(register);
router
    .route('/login')
    .post(login);
module.exports = router;