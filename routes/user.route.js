const router = require("express").Router();
const bcrypt = require("bcryptjs"); // change password to #
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const auth = require("../middlewares/auth");

router.post("/signup", async (req, res, next) => {
  try {
    let { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ msg: "Not all fields have been entered" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: passwordHash,
      role: role,
    });

    const savedUser = await newUser.save();
    res.json({ msg: "Created new user", savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Not all fields have been entered." });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "No account with this email has been resistered." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SIGN);

    res.json({
      msg: `Welcome ${user.name}`,
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenIsValid", async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SIGN);
    if (!verified) {
      return res.json(false);
    }
    const user = await User.findById(verified.id);
    if (!user) {
      return res.json(flase);
    }

    console.log("verified!");
    return res.json(true);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res, next) => {
  const user = await User.findById(req.user);
  return res.json({
    users: user,
  });
});

// router.patch("/:id/likedPost", async (req, res, next) => {});

module.exports = router;
