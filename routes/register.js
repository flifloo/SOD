let express = require("express");
let router = express.Router();
let models = require("../models");
let userCreate = require("./utils/userCreate");
let reCaptcha = require("../middlewares/reCaptcha");


router.get("/", async (req, res) => {
    if (req.session.user)
        res.redirect("/");
    else
        res.render("register", {title: "SOD - register", departments: await models.Department.findAll({where: {enable: true}})});
})
    .post("/", reCaptcha, async (req, res) => {
        let user = await userCreate(req, res);
        if (user) {
            req.session.user = user;
            res.redirect("/");
        }
    });

module.exports = router;
