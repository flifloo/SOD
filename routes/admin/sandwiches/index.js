let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/sandwiches/index", {
        title: "SOD - Sandwiches administration",
        sandwiches: await models.Sandwich.findAll()
    });
})
    .use("/edit", require("./edit"))
    .use("/add", require("./add"))
    .get("/delete", sessionCheck(3), async (req, res) => {
        if (!req.query.name)
            return error(req, res, "Can't remove sandwich !", 400, "Missing arg");

        let sandwich = await models.Sandwich.findByPk(req.query.name);
        if (!sandwich)
            return error(req, res, "Can't remove sandwich !", 400, "Invalid sandwich");

        await sandwich.destroy();
        res.redirect("/admin/sandwiches");
    });

module.exports = router;
