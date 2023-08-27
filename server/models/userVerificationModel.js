const mongoose = require('mongoose')

const userVerificationModel = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    otp: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    expiresAt: {
        type: Date,
    }
})

module.exports = mongoose.model("UserVerification", userVerificationModel);
