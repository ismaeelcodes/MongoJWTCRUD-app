const mongoose = require("mongoose");



const googleUserModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the user name"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    verified: {
      type: Boolean,
    }
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("GoogleUser", googleUserModel);
