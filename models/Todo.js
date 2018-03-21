const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  task: {
    type: String,
    trim: true,
    required: true,
    minlength: 1
  }
});

module.exports = mongoose.model("Todo", todoSchema);
