const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const contactService = require('./contact.service')

async function getContacts(req, res) {
    try {
        const contacts = await contactService.query(req.query)
        res.send(contacts)
    } catch (err) {
        logger.error('Cannot get contacts', err)
        res.status(500).send({ err: 'Failed to get contacts' })
    }
}

async function getContactById(req, res) {
    try {
        const contact = await contactService.getById(req.query)
        res.send(contact)
    } catch (err) {
        logger.error('Cannot get contacts', err)
        res.status(500).send({ err: 'Failed to get contacts' })
    }
}

async function deleteContact(req, res) {
    try {
        const deletedCount = await contactService.remove(req.params.id)
        if (deletedCount === 1) {
            res.send({ msg: 'Deleted successfully' })
        } else {
            res.status(400).send({ err: 'Cannot remove contact' })
        }
    } catch (err) {
        logger.error('Failed to delete contact', err)
        res.status(500).send({ err: 'Failed to delete contact' })
    }
}


async function addContact(req, res) {

    var loggedinUser = authService.validateToken(req.cookies.loginToken)

    try {
        var contact = req.body
        // contact.byUserId = loggedinUser._id
        contact = await contactService.add(contact)

        // prepare the updated contact for sending out
        // contact.aboutUser = await userService.getById(contact.aboutUserId)

        // Give the user credit for adding a contact
        // var user = await userService.getById(contact.byUserId)
        // user.score += 10

        // loggedinUser = await userService.update(loggedinUser)
        // contact.byUser = loggedinUser

        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)


        // socketService.broadcast({type: 'contact-added', data: contact, userId: contact.byUserId})
        // socketService.emitToUser({type: 'contact-about-you', data: contact, userId: contact.aboutUserId})

        // const fullUser = await userService.getById(loggedinUser._id)
        // socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

        res.send(contact)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add contact', err)
        res.status(500).send({ err: 'Failed to add contact' })
    }
}

module.exports = {
    getContacts,
    getContactById,
    deleteContact,
    addContact
}



