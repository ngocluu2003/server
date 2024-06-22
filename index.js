const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use(cors());

// Connect Mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "courses",
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

app.get("/", (req, res) => {
  res.send(
    `<h1 style="padding: 32px 120px; text-align: center; margin-top: 32px">
      Trang web cho phép người dùng đăng ký, đăng nhập, khám phá nhiều khóa học và mua sắm.
      <br />
      Ứng dụng cũng có một bảng điều khiển quản trị, nơi các quản trị viên có thể đăng nhập, đăng ký, tạo khóa học, và xuất bản hoặc giữ chúng ở trạng thái chưa xuất bản.
    </h1>`
  );
});

// Invalid Routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(3000, () => console.log("App is listening at port at 3000"));