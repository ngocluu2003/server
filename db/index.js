const mongoose = require("mongoose");

// Mongoose Schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const ReviewSchema = new mongoose.Schema({
  username: String,
  rating: Number,
  comment: String,
  avatar: String
});
const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String,
  image: String,
  link: String
});
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  tag: String,
  price: Number,
  imgLink: String,
  published: Boolean,
  books: [BookSchema], 
  reviews: [ReviewSchema], 
});

// Mongoose Models
const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Book = mongoose.model("Books", BookSchema);
const Review = mongoose.model("Review", ReviewSchema);
module.exports = { User, Admin, Course, Book, Review };