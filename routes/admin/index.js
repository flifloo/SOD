let express = require("express");
let router = express.Router();
let sessionCheck = require("../../middlewares/sessionCheck");
let models = require("../../models");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/index", {
        title: "SOD - Administration",
        user: req.session.user,
        sandwiches: await models.Sandwich.findAll(),
        users: await models.User.findAll()
    });
});

module.exports = router;
