let express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let session = require("express-session");
let logger = require("morgan");
let { I18n } = require("i18n");
let Recaptcha = require("express-recaptcha").RecaptchaV3;
let SMTPClient = require("emailjs").SMTPClient;
let config = process.env.NODE_ENV === "test" ? {} : require("./config/config.json");

let indexRouter = require("./routes/index");
let registerRouter = require("./routes/register");
let loginRouter = require("./routes/login");
let forgetRouter = require("./routes/forget");
let logoutRouter = require("./routes/logout");
let orderRouter = require("./routes/order");
let ordersRouter = require("./routes/orders");
let sandwichesRouter = require("./routes/sandwiches");
let profileRouter = require("./routes/profile");
let checkRouter = require("./routes/check");
let adminRouter = require("./routes/admin");
let contactRouter = require("./routes/contact");
let aboutRouter = require("./routes/about");

let app = express();
let sess = {
  secret: process.env.NODE_ENV === "test" ? "Keyboard Cat" : config.secret,
  cookie: {}
};
let i18n = new I18n({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  cookie: "locale",
  directory: __dirname + "/locales",
  objectNotation: true
});
let recaptcha = process.env.NODE_ENV === "test" ? null : new Recaptcha(config.reCaptcha.siteKey,
    config.reCaptcha.secretKey, {callback: "cb"});
let mailClient = new SMTPClient(process.env.NODE_ENV === "test" ? {} : config.email.server);

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
  sess.cookie.secure = true;
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("config", config);
app.set("recaptcha", recaptcha);
app.set("mailClient", mailClient);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));
app.use(i18n.init);
if(process.env.NODE_ENV === "test")
  app.locals.test = true;
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.captcha = process.env.NODE_ENV === "test" ? undefined : recaptcha.render();
  next();
});

app.use("/", indexRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/forget", forgetRouter);
app.use("/logout", logoutRouter);
app.use("/order", orderRouter);
app.use("/orders", ordersRouter);
app.use("/sandwiches", sandwichesRouter);
app.use("/profile", profileRouter);
app.use("/check", checkRouter);
app.use("/admin", adminRouter);
app.use("/contact", contactRouter);
app.use("/about", aboutRouter);

// catch 404 and forward to error handler
app.use((req, res) => {
  res.status(404);
  res.render("error", {title: "SOD - Page not found", message: "Page not found", "error": {}})
});

// error handler
app.use((err, req, res) => {
  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

module.exports = app;
