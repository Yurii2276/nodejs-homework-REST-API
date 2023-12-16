const { Contact } = require("../models");

const getContacts = async (req, res, next) => {
  console.log("GET /api/contacts called");

  try {
    const data = await Contact.find({});
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getContactnbyId = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await Contact.findById({ _id: contactId });
    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const postContact = async (req, res, next) => {
  console.log("POST /api/contacts directed...");
  console.log(req.body);
  try {
    const data = await Contact.create(req.body);
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await Contact.findByIdAndDelete(contactId);
    if (data) {
      return res.status(200).json({ message: "contact deleted" });
    }
    res.status(400).json({ message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const putContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const data = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
  } catch (erorr) {
    next(erorr);
  }
};

 const  updateStatusContact = async (contactId, updateBody) => 
 {
    return await Contact.findByIdAndUpdate(contactId, updateBody, { new: true });
}


const updateContactFavorite = async (req, res, next) => {

  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
  }

  const updatedContact = await updateStatusContact(contactId, { favorite });

  if (!updatedContact) {
    return res.status(404).json({ message: "Not found"});
}

    return res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContacts,
  getContactnbyId,
  postContact,
  deleteContact,
  putContact,
  updateContactFavorite,
};
