const express = require("express");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
} = require("../../controllers/usersController");

const ctrlWrapper = require("../../helpers/apiHelpers");
const authenticate = require("../../middlewares/authenticate");
const { validator } = require("../../middlewares/validationMidlewares");
const { schemas } = require("../../models/users");
const upload = require("../../middlewares/uploadFile");

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
  ctrlWrapper(updateAvatar)
);

module.exports = router;
