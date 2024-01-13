const { Schema, model } = require("mongoose");
const Joi = require("joi");
const handleSchemaErrors = require("../middlewares/handleSchemaErrors");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: {
    type: String,
    required: true,
  },
},
{ versionKey: false, timestamps: true }
);

userSchema.post("save", handleSchemaErrors);

const registerSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  
  const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });
  
  const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business").required(),
  });
  
  const schemas = {
    registerSchema,
    loginSchema,
    subscriptionSchema,
  };




const User = model("user", userSchema);

module.exports = { User, schemas };