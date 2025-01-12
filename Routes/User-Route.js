const express = require('express');
const router = express.Router()
const { singup, login, tokenverify,getUser} = require('../controllers/user-controll')
router.post('/singup', singup)
router.post('/login', login);
router.get('/user', tokenverify,getUser);

module.exports = router; 
