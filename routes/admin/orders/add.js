const express = require("express");
const router = express.Router();
const sessionCheck = require("../../../middlewares/sessionCheck");
const models = require("../../../models");
const addOrder = require("../../utils/addOrder");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/orders/add", {
        title: "SOD - Orders administration",
        departments: await models.Department.findAll({where: {enable: true}}),
        sandwiches: await models.Sandwich.findAll({where: {enable: true}}),
        users: await models.User.findAll()
    });
}).post("/", sessionCheck(3), async (req, res) => {
    await addOrder(req, res, {
        department: req.body.department,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        sandwiches: req.body.sandwiches,
        dates: req.body.dates,
        paid: req.body.paid,
        give: req.body.give
    }, false);
    res.redirect("/admin/orders");
});

module.exports = router;
