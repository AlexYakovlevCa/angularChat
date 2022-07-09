const express = require('express')
const {requireAuth} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addChatRoom, getChatRooms, deleteChatRoom} = require('./chatRoom.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getChatRooms)
router.post('/',  log, requireAuth, addChatRoom)
router.delete('/:id',  requireAuth, deleteChatRoom)

module.exports = router