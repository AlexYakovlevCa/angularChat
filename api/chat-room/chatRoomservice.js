const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('chatRoom')
        // const chatRooms = await collection.find(criteria).toArray()
        var chatRooms = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'aboutUser'
                }
            },
            {
                $unwind: '$aboutUser'
            }
        ]).toArray()
        chatRooms = chatRooms.map(chatRoom => {
            chatRoom.byUser = { _id: chatRoom.byUser._id, fullname: chatRoom.byUser.fullname }
            chatRoom.aboutUser = { _id: chatRoom.aboutUser._id, fullname: chatRoom.aboutUser.fullname }
            delete chatRoom.byUserId
            delete chatRoom.aboutUserId
            return chatRoom
        })

        return chatRooms
    } catch (err) {
        logger.error('cannot find chatRooms', err)
        throw err
    }

}

async function remove(chatRoomId) {
    try {
        const store = asyncLocalStorage.getStore()
        const { loggedinUser } = store
        const collection = await dbService.getCollection('chatRoom')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(chatRoomId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const {deletedCount} = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove chatRoom ${chatRoomId}`, err)
        throw err
    }
}


async function add(chatRoom) {
    try {
        const chatRoomToAdd = {
            byUserId: ObjectId(chatRoom.byUserId),
            aboutUserId: ObjectId(chatRoom.aboutUserId),
            txt: chatRoom.txt
        }
        const collection = await dbService.getCollection('chatRoom')
        await collection.insertOne(chatRoomToAdd)
        return chatRoomToAdd
    } catch (err) {
        logger.error('cannot insert chatRoom', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.byUserId) criteria.byUserId = filterBy.byUserId
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


