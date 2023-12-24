const { Contact } = require("../models");

const getContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20, favorite } = req.query;
    const query = favorite ? { owner, favorite } : { owner };

    const skip = (page - 1) * limit;
    const data = await Contact.find(query, "", {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id email");
    console.log(data);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const getContactnbyId = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const data = await Contact.findOne({ _id: contactId, owner: userId });
    if (!data) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const postContact = async (req, res, next) => {
  const { _id: owner } = req.user;

  try {
    const data = await Contact.create({ ...req.body, owner });
    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const contact = await Contact.findOne({ _id: contactId, owner: userId });
    if (!contact) {
      return res
        .status(404)
        .json({ message: "Not found or not owned by user" });
    }
    await Contact.findByIdAndDelete(contactId);
    return res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const putContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;

    const contact = await Contact.findOne({ _id: contactId, owner: userId });
    if (!contact) {
      return res
        .status(404)
        .json({ message: "Not found or not owned by user" });
    }

    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      req.body,
      { new: true }
    );
    return res.status(200).json(updatedContact);
  } catch (erorr) {
    next(erorr);
  }
};

const updateStatusContact = async (userId, contactId, updateBody) => {
  const contact = await Contact.findOne({ _id: contactId, owner: userId });
  if (!contact) {
    throw new Error("Not found or not owned by user");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    updateBody,
    { new: true }
  );
  return updatedContact;
};

const updateContactFavorite = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (favorite === undefined) {
      return res.status(400).json({ message: "missing field favorite" });
    }

    const userId = req.user._id; 
    const updatedContact = await updateStatusContact(userId, contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
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
