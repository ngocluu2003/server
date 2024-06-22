const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
require("dotenv").config();
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://your-frontend.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Private-Network", true);
  //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
  res.setHeader("Access-Control-Max-Age", 7200);

  next();
});
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