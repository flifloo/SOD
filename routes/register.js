let express = require("express");
let router = express.Router();
let models = require("../models");
let userCreate = require("./utils/userCreate");


router.get("/",  async (req, res) => {
    if (req.session.user)
        res.redirect("/");
    else
        res.render("register", {title: "SOD - register", departments: await models.Department.findAll()});
})
    .post("/", async (req, res) => {
        let user = await userCreate(req, res);
        if (user) {
            req.session.user = user;
            res.redirect("/");
        }
    });

module.exports = router;
