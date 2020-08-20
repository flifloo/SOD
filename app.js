let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let logger = require("morgan");
let { I18n } = require("i18n");

let indexRouter = require("./routes/index");
let registerRouter = require("./routes/register");
let loginRouter = require("./routes/login");
let logoutRouter = require("./routes/logout");
let orderRouter = require("./routes/order");
let ordersRouter = require("./routes/orders");
let sandwichesRouter = require("./routes/sandwiches");
let profileRouter = require("./routes/profile");
let adminRouter = require("./routes/admin");

let app = express();
let sess = {
  secret: process.env.NODE_ENV === "test" ? "Keyboard Cat" : require("./config/config.json").secret,
  cookie: {}
};
let i18n = new I18n({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  cookie: "locale",
  directory: __dirname + "/locales",
  objectNotation: true
});

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
app.use(i18n.init);

app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/order", orderRouter);
app.use("/orders", ordersRouter);
app.use("/sandwiches", sandwichesRouter);
app.use("/profile", profileRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404);
  res.render("error", {message: "Page not found", "error": {}})
});

// error handler
app.use((err, req, res) => {
  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    user: req.session.user,
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = app;
