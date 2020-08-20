let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");
let userUpdate = require("./utils/userUpdate");

router.get("/", sessionCheck(0), async (req, res) => {
    res.render("profile", {
        title: "SOD - Profile",
        user: req.session.user,
        departments: await models.Department.findAll(),
        orders: await models.Order.findAll({
            where: {UserUsername: req.session.user.username},
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
});

module.exports = router;
