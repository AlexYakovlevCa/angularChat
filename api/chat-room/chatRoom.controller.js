const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const chatRoomService = require('./chatRoom.service')

async function getChatRooms(req, res) {
    try {
        const chatRooms = await chatRoomService.query(req.query)
        res.send(chatRooms)
    } catch (err) {
        logger.error('Cannot get chatRooms', err)
        res.status(500).send({ err: 'Failed to get chatRooms' })
    }
}

async function deleteChatRoom(req, res) {
    try {
        const deletedCount = await chatRoomService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove chatRoom' })
        }
    } catch (err) {
        logger.error('Failed to delete chatRoom', err)
        res.status(500).send({ err: 'Failed to delete chatRoom' })
    }
}


async function addChatRoom(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)
 
    try {
        var chatRoom = req.body
        chatRoom.byUserId = loggedinUser._id
        chatRoom = await chatRoomService.add(chatRoom)
        
        // prepare the updated chatRoom for sending out
        chatRoom.aboutUser = await userService.getById(chatRoom.aboutUserId)
        
        // Give the user credit for adding a chatRoom
        // var user = await userService.getById(chatRoom.byUserId)
        // user.score += 10
        loggedinUser.score += 10

        loggedinUser = await userService.update(loggedinUser)
        chatRoom.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        const loginToken = authService.getLoginToken(loggedinUser)
        res.cookie('loginToken', loginToken)


        // socketService.broadcast({type: 'chatRoom-added', data: chatRoom, userId: chatRoom.byUserId})
        // socketService.emitToUser({type: 'chatRoom-about-you', data: chatRoom, userId: chatRoom.aboutUserId})
        
        const fullUser = await userService.getById(loggedinUser._id)
        socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(chatRoom)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add chatRoom', err)
        res.status(500).send({ err: 'Failed to add chatRoom' })
    }
}

module.exports = {
    getChatRooms,
    deleteChatRoom,
    addChatRoom
}