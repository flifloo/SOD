let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");
let userUpdate = require("./utils/userUpdate");
let emailCheck = require("./utils/emailCheck");
let error = require("./utils/error");

router.get("/", sessionCheck(0), async (req, res) => {
    res.render("profile", {
        title: "SOD - Profile",
        departments: await models.Department.findAll(),
        orders: await models.Order.findAll({
            where: {UserUsername: req.session.user.username, paid: true},
            include: models.Sandwich,
            order: ["date"]
        })
    });
}).post("/", sessionCheck(0), async (req, res) => {
    let user = await models.User.findByPk(req.session.user.username);

    user = await userUpdate(req, res, user);
    if (user) {
        req.session.user = user;
        res.redirect("/profile");
    }
}).get("/resend", sessionCheck(0), async (req, res) => {
    if (!req.session.user.emailVerified)
        await emailCheck(req, res, await models.User.findByPk(req.session.user.username), () => res.redirect("/profile"));
    else
        return error(req, res, "Can't' resend email", 400, "Email already verified");
});

module.exports = router;
