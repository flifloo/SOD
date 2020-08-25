const express = require("express");
const router = express.Router();
const error = require("./utils/error");
const models = require("../models");
const crypto = require("crypto");
const Message = require("emailjs").Message;


async function checkToken(req, res, token) {
    let user = await models.User.findOne({where: {passwordToken: token}});
    if (!user)
        return error(req, res, "Can't reset password", 400, "Invalid token");
    else if (user.passwordTokenDate && ((new Date().getTime() - user.passwordTokenDate.getTime())/1000 > 3600))
        return error(req, res, "Can't reset password", 400, "Token expired");
    else
        return user;
}


router.get("/", async (req, res) => {
    if (req.session.user)
        res.redirect("/");
    else
        if (!req.query.token)
            res.render("forget", {title: "SOD - Forget password"});
        else {
            if (await checkToken(req, res, req.query.token))
                res.render("forget", {title: "SOD - Change password", token: req.query.token})
        }
}).post("/", async (req, res) => {
    if (req.body.email && !req.body.password && !req.body.token) {
        let user = await models.User.findOne({where: {email: req.body.email}});
        let config = req.app.get("config");

        if (!user)
            return error(req, res, "Can't reset password", 400, "Invalid email");

        let token = crypto.randomBytes(16).toString("hex");
        while (await models.User.findOne({where: {passwordToken: token}}))
            token = crypto.randomBytes(16).toString("hex");

        req.app.get("mailClient").send( new Message({
            text: res.__("profile.forgetPasswordMessage", `${req.protocol}://${req.hostname}/forget?token=${token}`),
            from: config.email.from,
            to: user.email,
            subject: res.__("forgetPassword")
        }), async (err, message) => {
            if (err)
                return error(req, res, "Fail to send message !", 500,
                    req.app.get("env") !== "production" ? err : undefined);
            else {
                user.passwordToken = token;
                user.passwordTokenDate = new Date();
                await user.save();
                res.redirect("/");
            }
        });
    } else if (req.body.password && req.body.token && !req.body.email) {
        let user = await checkToken(res, res, req.body.token);
        if (user) {
            user.passwordToken = null;
            user.passwordTokenDate = null;
            user.passwordHash = req.body.password;
            await user.save();
            res.redirect("/login");
        }
    } else
        return error(req, res, "Can't change password", 400, "Invalid args");
});

module.exports = router;
