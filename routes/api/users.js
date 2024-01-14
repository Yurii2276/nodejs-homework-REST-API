const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
} = require("../../controllers/usersController");

const ctrlWrapper = require("../../helpers/apiHelpers");
const authenticate = require("../../middlewares/authenticate");
const { validator } = require("../../middlewares/validationMidlewares");
const { schemas } = require("../../models/users");
const upload = require("../../middlewares/uploadFile");
const resizeAvartar = require("../../middlewares/resizeAvatar");

const router = express.Router();

router.post(
  "/register",
  validator(schemas.registerSchema),
  ctrlWrapper(register)
);
router.post("/login", validator(schemas.loginSchema), ctrlWrapper(login));
router.get("/logout", authenticate, ctrlWrapper(logout));
router.get("/current", authenticate, ctrlWrapper(getCurrentUser));
router.patch(
  "/",
  authenticate,
  validator(schemas.subscriptionSchema),
  ctrlWrapper(updateSubscription)
);

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(resizeAvartar),
  ctrlWrapper(updateAvatar)
);

router.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
router.post(
  "/verify",
  validator(schemas.verifyEmailShema),
  ctrlWrapper(resendVerifyEmail)
);

module.exports = router;
