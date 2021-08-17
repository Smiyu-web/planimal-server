const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  itemId: {
    type: String,
  },
  userId: {
    type: String,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
