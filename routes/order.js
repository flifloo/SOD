let express = require("express");
let router = express.Router();
let models = require("../models");
let error = require("./utils/error");


router.post("/", async (req, res) => {
    if (!req.body.department || !req.body.firstName || !req.body.lastName || !req.body.sandwich1 || !req.body.date1)
        return error(req, res, "Invalid order !", 400, "Missing arguments");

    let department = await models.Department.findByPk(req.body.department);
    if (!department)
        return error(req, res, "Invalid order !", 400, "Invalid department");

    let sandwiches = [];
    let price = 0;
    for (let i = 1; req.body["sandwich" + i] !== undefined; i++) {
        if (req.body["date" + i] === undefined)
            return error(req, res, "Invalid order !", 400, "Sandwich without date");

        let sandwich = await models.Sandwich.findByPk(req.body["sandwich" + i]);
        if (!sandwich)
            return error(req, res, "Invalid order !", 400, "Invalid sandwich: "+req.body["sandwich" + i]);

        let date = new Date(req.body["date" + i]);
        let firstDate, lastDate;

        [firstDate, lastDate] = [await models.Data.findByPk("firstDate"),
            await models.Data.findByPk("lastDate")];

        let now = new Date();
        now.setUTCHours(0,0,0,0);

        if (firstDate && firstDate.value && lastDate && lastDate.value) {
            [firstDate, lastDate] = [new Date(firstDate.value), new Date(lastDate.value)];
            firstDate.setUTCHours(0,0,0,0);
            lastDate.setUTCHours(0,0,0,0);

            if (now.getTime() > date.getTime() ||
                firstDate.getTime() > date.getTime() ||
                lastDate.getTime() < date.getTime())
                return error(req, res, "Invalid order !", 400, "Date not available");
        }

        try {
        sandwiches.push([sandwich.name, date.toISOString().substring(0, 10)]);
        } catch {
            return error(req, res, "Invalid order !", 400, "Invalid date");
        }
        price += sandwich.price;
    }

    let order = await models.Order.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        price: price
    });
    let user = await models.User.findOne({where: {firstName: req.body.firstName, lastName: req.body.lastName}});
    if (user)
        await order.setUser(user);
    await order.setDepartment(department);
    for (let data of sandwiches)
        try {
            await models.SandwichOrder.create({OrderId: order.id, SandwichName: data[0], date: data[1]});
        } catch (e) {
            await order.destroy();
            error(req, res, "Invalid order !", 500);
            throw e;
        }
    res.send("Ok");
});

module.exports = router;
