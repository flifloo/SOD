const express = require("express");
const router = express.Router();
const sessionCheck = require("../../../middlewares/sessionCheck");
const error = require("../../utils/error");
const models = require("../../../models");


router.get("/", sessionCheck(3), async (req, res) => {
    if (!req.query.id)
        return error(req, res, "Missing arg", 400);

    let order = await models.Order.findByPk(req.query.id, {include: [models.Sandwich, models.User, models.Department]});
    if (!order)
        return error(req, res, "Invalid order !", 400);

    res.render("admin/orders/edit", {
        title: "SOD - Orders administration",
        order: order,
        departments: await models.Department.findAll(),
        sandwiches: await models.Sandwich.findAll(),
        users: await models.User.findAll()
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.id || !req.body.department || !req.body.firstName || !req.body.lastName ||
        req.body.sandwiches.length < 1 || req.body.dates.length < 1 ||
        req.body.sandwiches.length !==  req.body.dates.length)
        return error(req, res, "Missing arguments !", 400);

    let order = await models.Order.findByPk(req.body.id, {include: [models.Sandwich, models.User, models.Department]});
    if (!order)
        return error(req, res, "Invalid order edit !", 400, "Invalid order");

    let department = await models.Department.findByPk(req.body.department);
    if (!department)
        return error(req, res, "Invalid order edit !", 400, "Invalid department");
    if (department.name !== order.Department.name)
        await order.setDepartment(department);

    let user = null;
    if (req.body.username)
        user = await models.User.findOne({where: {username: req.body.username}});
    if (user && (!order.User || user.username !== order.User.username))
        await order.setUser(user);
    else if (!user && order.User)
        await order.setUser(null);

    let sandwiches = [];
    let price = 0;
    for (let s in req.body.sandwiches) {
        if (!req.body.dates[s])
            return error(req, res, "Invalid order edit !", 400, "Sandwich without date");

        let sandwich = await models.Sandwich.findByPk(req.body.sandwiches[s]);
        if (!sandwich)
            return error(req, res, "Invalid order edit !", 400, "Invalid sandwich: "+req.body.sandwiches[s]);

        let date = new Date(req.body.dates[s]);

        let give = false;
        if (req.body.give && req.body.give[s])
            give = req.body.give[s];

        try {
            sandwiches.push([sandwich.name, date.toISOString().substring(0, 10), give]);
        } catch {
            return error(req, res, "Invalid order edit !", 400, "Invalid date");
        }
        price += sandwich.price;
    }

    if (order.price !== price)
        order.price = price;

    if (req.body.firstName !== order.firstName)
        order.firstName = req.body.firstName;
    if (req.body.lastName !== order.lastName)
        order.lastName = req.body.lastName;
    if (req.body.paid !== order.paid)
        order.paid = Boolean(req.body.paid);

    await order.removeSandwiches(order.Sandwiches);
    for (let data of sandwiches)
        try {
            await models.SandwichOrder.create({OrderId: order.id, SandwichName: data[0], date: data[1], give: data[2]});
        } catch (e) {
            await order.destroy();
            error(req, res, "Invalid order !");
            throw e;
        }

    await order.save();

    res.redirect("/admin/orders");
});

module.exports = router;
