let express = require("express");
let router = express.Router();
let sessionCheck = require("../middlewares/sessionCheck");
let models = require("../models");
let sequelize = require("sequelize");


router.get("/", sessionCheck(1), async (req, res) => {
    let date = req.query.date ? req.query.date : (new Date()).toISOString().substring(0,10);

    res.render("sandwiches", {
        title: "SOD - Sandwiches",
        sandwiches: await models.Sandwich.findAll({
            attributes: ["name", [sequelize.fn("COUNT", sequelize.col("name")), "number"]],
            include: [{
                attributes: [],
                model: models.Order,
                where: {paid: true},
                through: {
                    attributes: [],
                    where: {date: date}
                },
                required: true
            }],
            group: "name"
        }),
        date: date});
});

module.exports = router;
