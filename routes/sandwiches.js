let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");
let sequelize = require("sequelize");


router.get("/", sessionCheck(1), async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    res.render("sandwiches", {
        title: "SOD",
        user: req.session.user,
        sandwiches: await models.SandwichCommand.findAll({
            attributes: ["SandwichName", [sequelize.fn("COUNT", sequelize.col("SandwichName")), "number"]],
            where: {date: date},
            group: "SandwichName"
        }),
        date: date});
});

module.exports = router;
