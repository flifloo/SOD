let express = require("express");
let router = express.Router();
let models = require("../models");


router.post("/", async (req, res) => {
    if (!req.body.department || !req.body.firstName || !req.body.lastName || !req.body.sandwich1 || !req.body.date1) {
        res.render("error", {message: "Invalid command !", "error": {status: "Missing arguments"}});
        return;
    }

    let department = await models.Department.findByPk(req.body.department);
    if (!department) {
        res.render("error", {message: "Invalid command !", error: {status: "Invalid department"}});
        return;
    }

    let sandwiches = [];
    let price = 0;
    for (let i = 1; req.body["sandwich" + i] !== undefined; i++) {
        if (req.body["date" + i] === undefined) {
            res.render("error", {message: "Invalid command !", error: {status: "Sandwich without date"}});
            return;
        }

        let sandwich = await models.Sandwich.findByPk(req.body["sandwich" + i]);
        if (!sandwich) {
            res.render("error", {
                message: "Invalid command !",
                error: {status: "Invalid sandwich: "+req.body["sandwich" + i]}
            });
            return;
        }
        sandwiches.push([sandwich.name, req.body["date" + i]]);
        price += sandwich.price;
    }

    let command = await models.Command.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        price: price
    });
    await command.setDepartment(department);
    for (let data of sandwiches)
        try {
            console.log(command.id);
            console.log(data);
            await models.SandwichCommand.create({CommandId: command.id, SandwichName: data[0], date: data[1]});
        } catch (e) {
            await command.destroy();
            res.render("error", {message: "Invalid command !", error: {status: "Invalid date"}});
            throw e;
        }
    res.send("Ok");
});

module.exports = router;
