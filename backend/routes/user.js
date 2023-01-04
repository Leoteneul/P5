const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const limiter = require('../middleware/rate-limit')


router.post('/signup', userCtrl.signup); // Route signup
router.post('/login', limiter, userCtrl.login); // Route signin

module.exports = router;