const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route
router.post('/signup', authController.signup);
router.get('/signup', (req, res) => {
    res.send('<h1>Signup endpoint</h1>');
});

// Login route
router.post('/login', authController.login);
router.get('/login', (req, res) => {
    res.send('<h1>Login endpoint</h1>');
});

module.exports = router;