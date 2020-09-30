let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");

router.get("/", sessionCheck(3), (req, res) => {
    res.render("admin/departments/add", {
        title: "SOD - Departments administration"
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.name)
        return error(req, res, "Fail to add department !", 400, "Missing arg");

    if (await models.Department.findByPk(req.body.name))
        return error(req, res, "Fail to add department", 400, "Name already used");

    await models.Department.create({name: req.body.name, enable: !!req.body.enable});
    res.redirect("/admin/departments");
});

module.exports = router;
