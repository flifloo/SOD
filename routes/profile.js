let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");
let error = require("./utils/error");

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

    /*if (req.body.username && req.body.username !== user.username)
        if (await models.User.findByPk(req.body.username))
            return error(req, res, "Invalid profile update !", 400, "Username already taken");
        else
            user.username = req.body.username;*/

    if (req.body.email && req.body.email !== user.email)
        if (await models.User.findOne({where: {email: req.body.email}}))
            return error(req, res, "Invalid profile update !", 400, "Email already used");
        else
            user.email = req.body.email;

    if (req.body.firstName && req.body.lastName &&
        (req.body.firstName !== user.firstName || req.body.lastName !== user.lastName))
        if (await models.User.findOne({where: {firstName: req.body.firstName, lastName: req.body.lastName}}))
            return error(req, res, "Invalid profile update !", 400, "First & last name already register");
        else {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            for (let c of await models.Order.findAll({where: {
                firstName: req.session.user.firstName,
                    lastName: req.session.user.lastName}})) {
                c.firstName = user.firstName;
                c.lastName = user.lastName;
                await c.save()
            }
        }

    if (req.body.department && req.body.department !== user.DepartmentName)
        if (!await models.Department.findByPk(req.body.department))
            return error(req, res, "Invalid profile update !", 400, "Invalid department");
        else
            user.DepartmentName = req.body.department;

    if (req.body.password && !user.checkPassword(req.body.password))
        user.passwordHash = req.body.password;

    await user.save();
    req.session.user = user;
    res.redirect("/profile");
});

module.exports = router;
