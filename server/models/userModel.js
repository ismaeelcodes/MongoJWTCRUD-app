const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    verified: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("User", userSchema);
