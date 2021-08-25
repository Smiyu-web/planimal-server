const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  retailPrice: {
    type: Number,
    required: true,
  },
  wholesalePrice: {
    type: Number,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  tags: { type: [Object], blackbox: true },
  image: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Item", itemSchema);
