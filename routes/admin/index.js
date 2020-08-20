let express = require("express");
let router = express.Router();
let sessionCheck = require("../../middlewares/sessionCheck");
let models = require("../../models");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/index", {
        title: "SOD - Administration",
        sandwiches: await models.Sandwich.findAll(),
        users: await models.User.findAll()
    });
})
    .use("/orders", require("./orders"))
    .use("/sandwiches", require("./sandwiches"))
    .use("/departments", require("./departments"))
    .use("/users", require("./users"));

module.exports = router;
