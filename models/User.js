const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    minlength: 1
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo"
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
