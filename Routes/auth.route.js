const express = require('express');
const router = express.Router();
const { login, singup, logout,forgetPassword,resetPassword,checkAuth } = require('../controllers/auth.controllers');
const Verfifytoken = require('../middleware/Verifytoken');
router.get('/check-auth',Verfifytoken,checkAuth)
router.post('/singup', singup)
router.post('/login', login);
router.post('/logout', logout);
router.post('/forget-password',forgetPassword)
router.post('/reset-password/:token',resetPassword);
module.exports = router;