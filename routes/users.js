const express = require('express');
const router = express.Router();
const users = require('../controllers/users')
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')


router.route('/register')
    .get(users.showRegisterPage)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.showLoginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout)

module.exports = router;