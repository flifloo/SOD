let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let logger = require("morgan");
let config = require("./config/config.json");

let indexRouter = require("./routes/index");
let registerRouter = require("./routes/register");
let loginRouter = require("./routes/login");
let logoutRouter = require("./routes/logout");
let commandRouter = require("./routes/command");
let ordersRouter = require("./routes/orders");
let sandwichesRouter = require("./routes/sandwiches");
let profileRouter = require("./routes/profile");
let adminRouter = require("./routes/admin");

let app = express();
let sess = {
  secret: config.secret,
  cookie: {}
}

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/command", commandRouter);
app.use("/orders", ordersRouter);
app.use("/sandwiches", sandwichesRouter);
app.use("/profile", profileRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.render("error", {message: "Page not found", "error": {}})
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
