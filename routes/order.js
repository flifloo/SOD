let express = require("express");
let router = express.Router();
let models = require("../models");
let error = require("./utils/error");
let lyfPay = require("./utils/lyfPay");
let addOrder = require("./utils/addOrder");


router.post("/", async (req, res) => {
    if (!req.body.payment || ["lyfPay", "creditCard"].indexOf(req.body.payment) < 0)
        return error(req, res, "Missing args !", 400);

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
    if (!req.session || !req.session.lastOrder)
        return error(req, res, "Can't retrieve last order", 400);

    req.body.payment = req.session.lastOrder[1];

    let order = await models.Order.findByPk(req.session.lastOrder[0].id);
    if (!order)
            return error(req, res, "Last order doesn't exist", 400);
    else
        await lyfPay.sendPayment(req, res, order);

});

module.exports = router;
