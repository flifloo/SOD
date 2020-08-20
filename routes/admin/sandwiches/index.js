let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/sandwiches/index", {
        title: "SOD - Sandwiches administration",
        user: req.session.user,
        sandwiches: await models.Sandwich.findAll()
    });
})
    .use("/edit", require("./edit"))
    .get("/delete", sessionCheck(3), async (req, res) => {
        if (!req.query.name)
            res.render("error", {message: "Can't remove sandwich !", error: {status: "Missing arg"}});
        else {
            let sandwich = await models.Sandwich.findByPk(req.query.name);
            if (!sandwich)
                res.render("error", {message: "Can't remove sandwich !", error: {status: "Invalid sandwich"}});
            else {
                await sandwich.destroy();
                res.redirect("/admin/sandwiches");
            }
        }
    });

module.exports = router;
