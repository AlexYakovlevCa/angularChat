const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('contact')
        // const contacts = await collection.find(criteria).toArray()
        var contacts = await collection.aggregate([
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
        contacts = contacts.map(contact => {
            contact.byUser = { _id: contact.byUser._id, userName: contact.byUser.userName }
            contact.aboutUser = { _id: contact.aboutUser._id, userName: contact.aboutUser.userName }
            delete contact.byUserId
            delete contact.aboutUserId
            return contact
        })

        return contacts
    } catch (err) {
        logger.error('cannot find contacts', err)
        throw err
    }

}

async function remove(contactId) {
    try {
        const { loggedinUser } = '' // We need to updated because of the als
        const collection = await dbService.getCollection('contact')
        // remove only if user is owner/admin
        const criteria = { _id: ObjectId(contactId) }
        if (!loggedinUser.isAdmin) criteria.byUserId = ObjectId(loggedinUser._id)
        const {deletedCount} = await collection.deleteOne(criteria)
        return deletedCount
    } catch (err) {
        logger.error(`cannot remove contact ${contactId}`, err)
        throw err
    }
}


async function add(contact) {
    try {
        const contactToAdd = {
            byUserId: ObjectId(contact.byUserId),
            aboutUserId: ObjectId(contact.aboutUserId),
            txt: contact.txt
        }
        const collection = await dbService.getCollection('contact')
        await collection.insertOne(contactToAdd)
        return contactToAdd
    } catch (err) {
        logger.error('cannot insert contact', err)
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


