let express = require("express");
let router = express.Router();
let models = require("../models");
let error = require("./utils/error");
let lyfPay = require("./utils/lyfPay");
let addOrder = require("./utils/addOrder");


router.post("/", async (req, res) => {
    let order = await addOrder(req, res, {
        department: req.body.department,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.session ? req.session.user ? req.session.user.username : undefined : undefined,
        sandwiches: req.body.sandwiches,
        dates: req.body.dates
    });
    await lyfPay.sendPayment(req, res, order);
}).get("/success", (req, res) => {
    res.render("order", {title: "SOD - Payment", state: "success"});
}).get("/cancel", (req, res) => {
    res.render("order", {title: "SOD - Payment", state: "cancel"});
}).get("/error", (req, res) => {
    res.render("order", {title: "SOD - Payment", state: "error"});
}).post("/callback", async (req, res) => {
    await lyfPay.checkPayment(req, res);
}).get("/retry", async (req, res) => {
    let order = await models.Order.findByPk(req.session.lastOrder.id);
    if (!order)
            return error(req, res, "Can't retrieve last order", 400);
    else
        await lyfPay.sendPayment(req, res, order);

});

module.exports = router;
