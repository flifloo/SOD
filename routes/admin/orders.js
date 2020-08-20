let express = require("express");
let router = express.Router();
let sessionCheck = require("../../middlewares/sessionCheck");
let models = require("../../models");
let error = require("../utils/error");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/orders", {
        title: "SOD - Orders administration",
        user: req.session.user,
        orders: await models.Order.findAll({include: models.Sandwich, order: ["date"]})
    });
}).post("/order/delete", sessionCheck(3), async (req, res) => {
    if (!req.body.id)
        return error(req, res, "Fail to remove order !", 400, "Missing args");

    try {
        await (await models.Order.findByPk(req.body.id)).destroy();
        res.redirect("/admin/orders");
    } catch (e) {
        error(req, res, "Fail to remove order !");
        throw e;
    }
}).post("/sandwich/delete", sessionCheck(3), async (req, res) => {
    if (!req.body.id)
        return error(req, res, "Fail to remove sandwich !", 400, "Missing args");

    try {
        let sandwich = await models.SandwichOrder.findByPk(req.body.id);
        let order = await models.Order.findByPk(sandwich.OrderId, {include: models.Sandwich});
        await sandwich.destroy();
        await order.reload();
        if (!order.Sandwiches.length)
            await order.destroy();
        res.redirect("/admin/orders");
    } catch (e) {
        error(req, res, "Fail to remove sandwich !");
        throw e;
    }
});

module.exports = router;
