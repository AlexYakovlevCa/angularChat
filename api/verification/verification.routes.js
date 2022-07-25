const express = require('express')
const { log } = require('../../middlewares/logger.middleware')

const { sendVerification, matchVerification } = require('./verification.controller')

const router = express.Router()




router.get('/:phoneNum', log, sendVerification)
router.post('/', log, matchVerification)
module.exports = router