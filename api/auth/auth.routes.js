const express = require('express')
const {authenticate, logout} = require('./auth.controller')

const router = express.Router()

// router.post('/login', login)
// router.post('/signup', signup)
router.post('/authenticate', authenticate)
router.post('/logout', logout)

module.exports = router