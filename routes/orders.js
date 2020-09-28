let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");
let error = require("./utils/error");


router.get("/", sessionCheck(2), async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    let orders = {};
    for (let o of await models.Order.findAll({
        where: {paid: true},
        include: [{
            model: models.Sandwich,
            through: {
                where: {date: date, give: false}
            },
            required: true
        }]
    })) {
        let name = o.firstName + " " + o.lastName;

        if (!(o.DepartmentName in orders))
            orders[o.DepartmentName] = {};

        if (!(name in orders[o.DepartmentName]))
            orders[o.DepartmentName][name] = {};

        orders[o.DepartmentName][name][o.id] = o.Sandwiches;
    }
    res.render("orders", {title: "SOD - Orders", orders: orders, date: date});
}).get("/give", sessionCheck(2), async (req, res) => {
    if (!req.query.id)
        return error(req, res, "Missing arg !", 400);

    let order = await models.SandwichOrder.findByPk(req.query.id, {where: {give: false}});
    if (!order)
        return error(req, res, "Invalid order id !", 400);

    order.give = true;
    await order.save();

    res.redirect("/orders")
});

module.exports = router;
