const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;

const RequestError = require("../helpers/requestError");
const { User } = require("../models/users");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const result = await User.create({ email, password: hashPassword });
  res.status(201).json({
    email: result.email,
    password: result.password,
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

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
};
