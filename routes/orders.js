let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");


router.get("/", sessionCheck(2), async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    let orders = {};
    for (let o of await models.Order.findAll({
        where: {paid: true},
        include: [{
            model: models.Sandwich,
            through: {
                where: {date: date}
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
});

module.exports = router;
