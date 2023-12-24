const express = require('express')

const {
  getContacts,
  getContactnbyId,
  postContact,
  deleteContact,
  putContact,
  updateContactFavorite,
} = require("../../controllers/contactsController");

const { validator } = require('../../middlewares/validationMidlewares');
const { addContactSchema, updateFavoriteSchema } = require('../../models/contacts');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router()

router.get('/', authenticate, getContacts)


router.get('/:contactId', authenticate, getContactnbyId)

router.post('/', authenticate, validator(addContactSchema), postContact)

router.delete('/:contactId', authenticate, deleteContact)

router.put('/:contactId', authenticate, validator(addContactSchema), putContact)

router.patch(
  "/:contactId/favorite", authenticate, validator(updateFavoriteSchema), updateContactFavorite);


module.exports = router
