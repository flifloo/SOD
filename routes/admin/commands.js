let express = require("express");
let router = express.Router();
let sessionCheck = require("../../middlewares/sessionCheck");
let models = require("../../models");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/commands", {
        title: "SOD",
        user: req.session.user,
        commands: await models.Command.findAll({include: models.Sandwich, order: ["date"]})
    });
}).post("/command/delete", sessionCheck(3), async (req, res) => {
    if (!req.body.id)
        res.render("error", {message: "Fail to remove command !", error: {status: "Missing args"}});
    try {
        await (await models.Command.findByPk(req.body.id)).destroy();
        res.redirect("/admin/commands");
    } catch (e) {
        res.render("error", {message: "Fail to remove command !", error: {}});
        throw e;
    }
}).post("/sandwich/delete", sessionCheck(3), async (req, res) => {
    if (!req.body.id)
        res.render("error", {message: "Fail to remove sandwich !", error: {status: "Missing args"}});
    try {
        let sandwich = await models.SandwichCommand.findByPk(req.body.id);
        let command = await models.Command.findByPk(sandwich.CommandId, {include: models.Sandwich});
        await sandwich.destroy();
        await command.reload();
        if (!command.Sandwiches.length)
            await command.destroy();
        res.redirect("/admin/commands");
    } catch (e) {
        res.render("error", {message: "Fail to remove sandwich !", error: {}});
        throw e;
    }
});

module.exports = router;
