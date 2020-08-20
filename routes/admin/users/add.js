let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let userCreate = require("../../utils/userCreate");

router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/users/add", {
        title: "SOD - Users administration",
        departments: await models.Department.findAll()
    });
}).post("/", sessionCheck(3), async (req, res) => {
    let user = await userCreate(req, res);
    if (user) {
        if (req.body.permissions && 0 >= req.body.permissions <= 3) {
            user.permissions = req.body.permissions;
            await user.save();
        }
        res.redirect("/admin/users");
    }
});

module.exports = router;
