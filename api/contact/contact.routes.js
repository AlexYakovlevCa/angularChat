const express = require('express')
const {requireAuth} = require('../../middlewares/requireAuth.middleware')
const {log} = require('../../middlewares/logger.middleware')
const {addContact, getContacts, deleteContact,getContactById} = require('./contact.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log,requireAuth, getContacts)
router.get('/:id', log,requireAuth, getContactById)
router.post('/',  log, requireAuth, addContact)
router.delete('/:id',  requireAuth, deleteContact)

module.exports = router