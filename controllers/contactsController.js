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
    // const { contactId: _id } = req.params;
    // const { contactId } = req.params;
    const { _id: owner } = req.user;
    const data = await Contact.findById({ _id: owner });
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
    const data = await Contact.create({...req.body, owner});
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
