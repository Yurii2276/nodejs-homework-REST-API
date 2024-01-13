const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const { SECRET_KEY } = process.env;

const RequestError = require("../helpers/requestError");
const { User } = require("../models/users");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ email, password: hashPassword, avatarURL });
  res.status(201).json({
    email: result.email,
    password: result.password,
    avatarURL,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !passwordCompare) {
    throw RequestError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    status: "success",
    code: 200,
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "Logout success" });
};

const getCurrentUser = async (req, res) => {
  const { email } = req.user;
  res.json({
    email,
  });
};

const updateSubscription = async (req, res) => {
  const { _id: owner } = req.user;
  const data = await User.findByIdAndUpdate(owner, req.body, {
    new: true,
  });
  if (!data) {
    return res.status(400).json({ message: "Not found" });
  }
  return res.status(200).json(data);
};

const updateAvatar = async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const avatarName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(
      process.cwd(),
      "public",
      "avatars",
      avatarName
    );
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", avatarName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
};
