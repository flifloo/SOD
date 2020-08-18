let express = require("express");
let router = express.Router();
let models = require("../models");


router.get("/",  async (req, res) => {
    if (req.session.user)
        res.redirect("/");
    else
        res.render("register", {title: "SOD - register", departments: await models.Department.findAll()});
})
    .post("/", async (req, res) => {
        if (!req.body.username || !req.body.email || !req.body.firstName || !req.body.lastName ||
            !req.body.department || !req.body.password)
            res.render("error", {message: "Invalid register !", error: {status: "Missing args"}});
        else if (await models.User.findByPk(req.body.username))
            res.render("error", {message: "Invalid register !",
                error: {status: "Username already taken"}});
        else if (await models.User.findOne({where: {firstName: req.body.firstName,
                lastName: req.body.lastName}}))
            res.render("error", {message: "Invalid register !",
                error: {status: "First & last name already register"}});
        else if (await models.User.findOne({where: {email: req.body.email}}))
            res.render("error", {message: "Invalid register !", error: {status: "Email already used"}});
        else {
            let department = await models.Department.findByPk(req.body.department);
            if (!department)
                res.render("error", {message: "Invalid register !",
                    error: {status: "Invalid department"}});
            else {
                try {
                    let user = await models.User.create({
                        username: req.body.username,
                        email: req.body.email,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        passwordHash: req.body.password
                    });

                    await user.setDepartment(department);
                    req.session.user = user;
                    res.redirect("/");
                    for (let c of await models.Order.findAll({where: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            UserUsername: null
                        }}))
                        await c.setUser(user);
                } catch (e) {
                    res.render("error", {message: "Registration fail !", error: {}});
                    throw e;
                }
            }
        }
    });

module.exports = router;
