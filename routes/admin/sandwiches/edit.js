let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");

router.get("/", sessionCheck(3), async (req, res) => {
    if (!req.query.name)
        res.render("error", {message: "Can't edit sandwich !", error: {status: "Missing arg"}});
    else {
        let sandwich = await models.Sandwich.findByPk(req.query.name);
        if (!sandwich)
            res.render("error",
                {message: "Can't edit sandwich !", error: {status: "Sandwich not found"}});
        else
            res.render("admin/sandwiches/edit", {
                title: "SOD - Sandwiches administration",
                user: req.session.user,
                sandwich: sandwich
            });
    }
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.name)
        res.render("error", {message: "Fail to edit sandwich !", error: {status: "Missing arg"}});
    else {
        let sandwich = await models.Sandwich.findByPk(req.body.name);
        if (!sandwich)
            res.render("error",
                {message: "Fail to edit sandwich !", error: {status: "Invalid sandwich name"}});
        else {
            if (req.body.price && req.body.price !== sandwich.price)
                sandwich.price = req.body.price;
            await sandwich.save();
            if (req.body.newName && req.body.newName !== sandwich.name)
                await models.Sandwich.update({name: req.body.newName}, {where: {name: req.body.name}});
            res.redirect("/admin/sandwiches");
        }
    }
});

module.exports = router;
