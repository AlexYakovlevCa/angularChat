
const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const chatRoomService = require('../chat-room/chatRoom.service')
const authService = require('../auth/auth.service')
const { ObjectId } = require('mongodb')

module.exports = {
    query,
    getById,
    getByPhoneNum,
    remove,
    update,
    add
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection('user')
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            user.createdAt = ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: ObjectId(userId) })
        // user.givenChatRooms = await chatRoomService.query({ byUserId: ObjectId(user._id) })
        //     .map(chatRoom => {
        //         delete chatRoom.byUser
        //         return chatRoom
        //     })
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}
async function getByPhoneNum(phoneNum) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ phoneNum })
        console.log(phoneNum, 'GETBYPHONE')
        // user.givenChatRooms = await chatRoomService.query({ byUserId: ObjectId(user._id) })

        //NEED TO FIX THE BUGS
        return user
    } catch (err) {
        logger.error(`while finding user with phone number ${phoneNum}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ '_id': ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        user._id = ObjectId(user._id)

        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: user._id }, { $set: user })
        return user
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.insertOne(user)
        return user
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                userName: txtCriteria
            }
        ]
    }
    if (filterBy.minBalance) {
        criteria.score = { $gte: filterBy.minBalance }
    }
    return criteria
}




