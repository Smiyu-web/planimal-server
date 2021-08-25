const router = require("express").Router();
const multer = require("multer");
const Item = require("../models/item.model");
const mongoose = require("mongoose");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../../public/assets/uploads"));
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/", async (req, res, next) => {
  try {
    const item = await Item.find();
    res.status(200).json(item);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post("/add-item", upload.single("image"), async (req, res, next) => {
  try {
    let { title, description, retailPrice, wholesalePrice, qty, tags, image } =
      req.body;
    if (
      !title ||
      !description ||
      !retailPrice ||
      !wholesalePrice ||
      !qty ||
      !tags
    ) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }

    const newItem = new Item({
      title: title,
      description: description,
      retailPrice: retailPrice,
      wholesalePrice: wholesalePrice,
      qty: qty,
      tags: tags,
      image: req.file.originalname,
    });
    const savedItem = await newItem.save();
    res.json({ msg: "Added new item", savedItem });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  const { title, description, retailPrice, wholesalePrice, qty, tags, image } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No data with id: ${id}`);
  const updatedItem = {
    title,
    description,
    retailPrice,
    wholesalePrice,
    qty,
    tags,
    image,
    _id: id,
  };
  await Item.findByIdAndUpdate(id, updatedItem, { new: true });

  res.json(updatedItem);
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("No item with id");

  await Item.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
});

module.exports = router;
