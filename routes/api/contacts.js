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

const router = express.Router()

router.get('/', getContacts)


router.get('/:contactId', getContactnbyId)

router.post('/', validator(addContactSchema), postContact)

router.delete('/:contactId', deleteContact)

router.put('/:contactId', validator(addContactSchema), putContact)

router.patch(
  "/:contactId/favorite", validator(updateFavoriteSchema), updateContactFavorite);


module.exports = router
