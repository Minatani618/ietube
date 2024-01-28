//ietube
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

/* ルーター 設定 */
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
let ietubeRouter = require("./routes/ietube");
let imagesRouter = require("./routes/images/images");
let imagesListRouter = require("./routes/images/folderListMenu");
let imagesIndRouter = require("./routes/images/folderIndPage");
let moviesRouter = require("./routes/movies/movies");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // 静的ファイルのパス設定

/* ルーター 設置 */
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/ietube", ietubeRouter);

app.use("/ietube/images", imagesRouter); //images
app.use("/ietube/images/folderListMenu", imagesListRouter); //images
app.use("/ietube/images/folderIndPage", imagesIndRouter); //images
app.use("/ietube/movies", moviesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
