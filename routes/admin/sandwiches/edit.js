let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");

router.get("/", sessionCheck(3), async (req, res) => {
    if (!req.query.name)
        return error(req, res, "Can't edit sandwich !", 400, "Missing arg");

    let sandwich = await models.Sandwich.findByPk(req.query.name);
    if (!sandwich)
        return error(req, res, "Can't edit sandwich !", 400, "Sandwich not found");

    res.render("admin/sandwiches/edit", {
        title: "SOD - Sandwiches administration",
        sandwich: sandwich
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.name)
        return error(req, res, "Fail to edit sandwich !", 400, "Missing arg");

    let sandwich = await models.Sandwich.findByPk(req.body.name);
    if (!sandwich)
        return error(req, res, "Fail to edit sandwich !", 400, "Invalid sandwich name");

    if (req.body.price && req.body.price !== sandwich.price)
        sandwich.price = req.body.price;
    await sandwich.save();
    if (req.body.newName && req.body.newName !== sandwich.name)
        await models.Sandwich.update({name: req.body.newName}, {where: {name: req.body.name}});
    res.redirect("/admin/sandwiches");
});

module.exports = router;
