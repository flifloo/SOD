const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/", async (req, res) => {
    if (req.session.user)
        res.redirect("/")
    else
        res.render("login", { title: "SOD - Login" });
})
    .post("/", async (req, res) => {
        if (!req.body.username || !req.body.password)
            res.redirect("/login");
        else {
            let u = await models.User.findByPk(req.body.username);
            if (!u || !u.checkPassword(req.body.password))
                res.redirect("/login?err=true");
            else {
                req.session.user = u;
                if (req.session.lastUrl && !req.session.lastUrl.startsWith("/login"))
                    res.redirect(req.session.lastUrl);
                else
                    res.redirect("/");
            }
        }
    });

module.exports = router;
