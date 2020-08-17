let express = require("express");
let router = express.Router();
let models = require("../models");


router.get("/", async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    let commands = {};
    for (let i of await models.SandwichCommand.findAll({where: {date: date}})) {
        i.Command = await models.Command.findByPk(i.CommandId);
        i.Sandwich = await models.Sandwich.findByPk(i.SandwichName);
        let name = i.Command.firstName + " " + i.Command.lastName;

        if (!(i.Command.DepartmentName in commands))
            commands[i.Command.DepartmentName] = {};

        if (!(name in commands[i.Command.DepartmentName]))
            commands[i.Command.DepartmentName][name] = {};

        if (!(i.Command.id in commands[i.Command.DepartmentName][name]))
            commands[i.Command.DepartmentName][name][i.Command.id] = []
        commands[i.Command.DepartmentName][name][i.Command.id].push(i);
    }
    res.render("orders", {title: "SOD", commands: commands, date: date});
});

module.exports = router;