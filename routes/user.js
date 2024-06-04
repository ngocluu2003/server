const express = require("express");
const jwt = require("jsonwebtoken");
const { User, Admin, Course } = require("../db");
const { authenticateJWT, SECRETKEY } = require("../middleware/auth");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  const user =
    (await User.findOne({ username })) || (await User.findOne({ email }));
  if (!user) {
    const newUser = new User({ email, username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  } else {
    res.status(403).send({ message: "User already exists" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRETKEY, {
      expiresIn: "1h",
    });
    res.send({ message: "Logged in successfully", token });
  } else {
    res.status(403).send({ message: "User not found" });
  }
});

router.get("/me", authenticateJWT, async (req, res) => {
  const user = req.user.username;
  res.json(user);
});

// Get courses Available
router.get("/courses", async (req, res) => {
  let courses = await Course.find({ published: true });
  const { filter } = req.query;
  try {
    if (filter === 'free') {
      courses = await Course.find({ price: 0 });
    } else if (filter === 'paid') {
      courses = await Course.find({ price: { $gt: 0 } });
    } else {
      courses = await Course.find();
    }
    res.json(courses);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Find course by ID
router.get("/courses/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Buy Course
router.post("/courses/:id", authenticateJWT, async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

// Show Purchased courses
router.get("/purchasedCourses", authenticateJWT, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

module.exports = router;