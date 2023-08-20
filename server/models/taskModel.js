const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please add the contact name"],
    },
    description: {
      type: String,
      required: [true, "Please add the contact email address"],
    },
    completed : {
      type: Boolean,
      required: [true, "Please mark as incomplete."]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", taskSchema);
