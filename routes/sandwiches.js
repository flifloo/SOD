let express = require("express");
let router = express.Router();
let models = require("../models");
let sequelize = require("sequelize")


router.get("/", async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    res.render("sandwiches", {
        title: "SOD",
        sandwiches: await models.SandwichCommand.findAll({
            attributes: ["SandwichName", [sequelize.fn("COUNT", sequelize.col("SandwichName")), "number"]],
            where: {date: date},
            group: "SandwichName"
        }),
        date: date});
});

module.exports = router;
