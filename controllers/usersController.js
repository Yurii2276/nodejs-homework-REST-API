const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const gravatar = require("gravatar");
const fs = require("fs/promises");
const path = require("path");

const { nanoid } = require("nanoid");

const { SECRET_KEY } = process.env;

const RequestError = require("../helpers/requestError");
const { User } = require("../models/users");
const sendEmail = require("../helpers/sendEmail");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw RequestError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const result = await User.create({ email, password: hashPassword, avatarURL, verificationToken });

  const mail = {
    to: email,
    subject: "Підтвердження реєстрації на сайті",
    text: "Привіт. Ми тестуємо надсилання листів!",
    html: `<a href="http://localhost:3000/users/verify/${verificationToken}" target="_blank">Натисніть для підтвердження</a>`,
  };

  await sendEmail(mail);

  res.status(201).json({
    email: result.email,
    password: result.password,
    avatarURL,
    verificationToken,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!user || !passwordCompare) {
    throw RequestError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw RequestError(400, "Email not verify"); 
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

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw RequestError(404, "Not Found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw RequestError(404, "Not Found");
  }
  if (user.verify) {
    throw RequestError(400, "Verification has already been passed");
  }

  const mail = {
    to: email,
    subject: "Підтвердження реєстрації на сайті",
    html: `<a href="http://localhost:3000/users/verify/${user.verificationToken}" target="_blank">Натисніть для підтвердження</a>`,
  };
  await sendEmail(mail);

  res.json({
    message: "Verification email sent",
  });
};


module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
