let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");
let userUpdate = require("../../utils/userUpdate");

router.get("/", sessionCheck(3), async (req, res) => {
    if (!req.query.name)
        return error(req, res, "Can't edit user !", 400, "Missing arg");

    let user = await models.User.findByPk(req.query.name);
    if (!user)
        return error(req, res, "Can't edit user !", 400, "user not found");

    res.render("admin/users/edit", {
        title: "SOD - Users administration",
        targetUser: user,
        departments: await models.Department.findAll()
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.oldUsername)
        return error(req, res, "Fail to edit user !", 400, "Missing arg");

    let user = await models.User.findByPk(req.body.oldUsername);

    user = await userUpdate(req, res, user);

    if (user) {
        if (req.body.permissions && 0 >= req.body.permissions <= 3) {
            user.permissions = req.body.permissions;
            await user.save();
        }
        res.redirect("/admin/users");
    }
});

module.exports = router;
