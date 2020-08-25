let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");


router.get("/", sessionCheck(3), async (req, res) => {
    let firstDate = await models.Data.findByPk("firstDate");
    let lastDate = await models.Data.findByPk("lastDate");

    if ((!firstDate || !firstDate.value) || (!lastDate || !lastDate.value))
        [firstDate, lastDate] = [undefined, undefined];
    else
        [firstDate, lastDate] = [firstDate.value, lastDate.value];

    res.render("admin/orders/date", {
        title: "SOD - Orders administration",
        date: {firstDate: firstDate, lastDate: lastDate}
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.firstDate || ! req.body.lastDate)
        return error(req, res, "Fail to set date !", 400, "Missing args");

    let firstDate = await models.Data.findByPk("firstDate");
    let lastDate = await models.Data.findByPk("lastDate");

    if (!firstDate)
        firstDate = await models.Data.create({key: "firstDate", value: ""});
    if (!lastDate)
        lastDate = await models.Data.create({key: "lastDate", value: ""});

    try {
        [firstDate.value, lastDate.value] = [(new Date(req.body.firstDate)).toISOString().substring(0,10),
            (new Date(req.body.lastDate)).toISOString().substring(0,10)];
        await firstDate.save();
        await lastDate.save();
    } catch {
        return error(req, res, "Fail to set date !", 400, "Invalid date");
    }

    res.redirect("/admin");
});

module.exports = router;
