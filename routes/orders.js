let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");


router.get("/", sessionCheck(2), async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    let orders = {};
    for (let i of await models.SandwichOrder.findAll({where: {date: date}})) {
        i.Order = await models.Order.findByPk(i.OrderId);
        i.Sandwich = await models.Sandwich.findByPk(i.SandwichName);
        let name = i.Order.firstName + " " + i.Order.lastName;

        if (!(i.Order.DepartmentName in orders))
            orders[i.Order.DepartmentName] = {};

        if (!(name in orders[i.Order.DepartmentName]))
            orders[i.Order.DepartmentName][name] = {};

        if (!(i.Order.id in orders[i.Order.DepartmentName][name]))
            orders[i.Order.DepartmentName][name][i.Order.id] = [];
        orders[i.Order.DepartmentName][name][i.Order.id].push(i);
    }
    res.render("orders", {title: "SOD - Orders", orders: orders, date: date});
});

module.exports = router;
