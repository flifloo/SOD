let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");

router.get("/", sessionCheck(3), (req, res) => {
    res.render("admin/sandwiches/add", {
        title: "SOD - Sandwiches administration"
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.name || !req.body.price)
        return error(req, res, "Fail to add sandwich !", 400, "Missing arg");

    if (await models.Sandwich.findByPk(req.body.name))
        return error(req, res, "Fail to add sandwich", 400, "Name already used");

    await models.Sandwich.create({name: req.body.name, price: req.body.price, enable: !!req.body.enable});
    res.redirect("/admin/sandwiches");
});

module.exports = router;
