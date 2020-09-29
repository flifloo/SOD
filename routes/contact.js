let express = require("express");
let router = express.Router();
let error = require("./utils/error");
let reCaptcha = require("../middlewares/reCaptcha");
let Message = require("emailjs").Message;


router.get("/", async (req, res) => {
    res.render("contact", {title: "SOD - Contact", send: req.query.send});
}).post("/", reCaptcha, async (req, res) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.subject || ! req.body.message)
        return error(req, res, "Invalid contact form !", 400, "Missing arg");

    let config = req.app.get("config");

    req.app.get("mailClient").send( new Message({
        text:
`${req.body.firstName} ${req.body.lastName} <${req.body.email}> ${req.body.phoneNumber ? "["+req.body.phoneNumber+"] " : ""}- ${req.body.subject}

${req.body.message}`,
        from: config.email.from,
        to: config.email.contact,
        cc: `${req.body.firstName} ${req.body.lastName} <${req.body.email}>`,
        subject: res.__("contact")+": "+req.body.subject
    }), (err, message) => {
        if (err)
            return error(req, res, "Fail to send message !", 500,
                req.app.get("env") !== "production" ? err : undefined);
        else
            res.redirect("/contact?send=1");
    });
});

module.exports = router;
