let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/orders", {
        title: "SOD - Orders administration",
        orders: await models.Order.findAll({include: models.Sandwich, order: ["date"]})
    });
}).get("/delete", sessionCheck(3), async (req, res) => {
    if (!req.query.id)
        return error(req, res, "Fail to remove order !", 400, "Missing args");

    let order = await models.Order.findByPk(req.query.id);
    if (!order)
        return error(req, res, "Invalid order !", 400);

    await order.destroy();
    res.redirect("/admin/orders");
}).use("/date", require("./date"))
    .use("/add", require("./add"))
    .use("/edit", require("./edit"));

module.exports = router;
