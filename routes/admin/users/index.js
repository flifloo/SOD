let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/users/index", {
        title: "SOD - Users administration",
        users: await models.User.findAll()
    });
})
    .use("/edit", require("./edit"))
    .use("/add", require("./add"))
    .get("/delete", sessionCheck(3), async (req, res) => {
        if (!req.query.name)
            return error(req, res, "Can't remove user !", 400, "Missing arg");

        let user = await models.User.findByPk(req.query.name);
        if (!user)
            return error(req, res, "Can't remove user !", 400, "Invalid user");

        await user.destroy();
        res.redirect("/admin/users");
    });

module.exports = router;
