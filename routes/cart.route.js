const router = require("express").Router();
const Cart = require("../models/cart.model");
const mongoose = require("mongoose");

router.get("/", async (req, res, next) => {
  try {
    const cartItem = await Cart.find();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post("/add-to-cart", async (req, res, next) => {
  try {
    let { itemId, userId } = req.body;
    console.log(req.body);

    const addedNewItem = new Cart({
      itemId: itemId,
      userId: userId,
    });
    const addedItem = await addedNewItem.save();
    res.json({ msg: "Added new item to cart", addedItem });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with id");

  await Item.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});

module.exports = router;
