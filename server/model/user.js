const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: (val) => {
      if (!validator.isEmail(val)) {
        throw new Error("Invalid Email ID");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: (val) => {
      if (val.length < 8 || val.includes("password")) {
        throw new Error("Invalid Password");
      }
    },
  },
  publicKey: {
    type: String,
  },
  privateKey: {
    type: String,
  },
  address: {
    type: String,
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  try {
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  } catch (error) {
    console.log(error);
  }
  next();
});

UserSchema.static("findByCredentials", function (email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email }).exec();
      if (!user) {
        throw new Error("Unable to login!");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Unable to login");
      }
      resolve(user);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
});

const User = mongoose.model("User", UserSchema, "User");
module.exports = User;
