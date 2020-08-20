let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");

router.get("/", sessionCheck(3), async (req, res) => {
    if (!req.query.name)
        return error(req, res, "Can't edit department !", 400, "Missing arg");

    let department = await models.Department.findByPk(req.query.name);
    if (!department)
        return error(req, res, "Can't edit department !", 400, "Department not found");

    res.render("admin/departments/edit", {
        title: "SOD - Departments administration",
        department: department
    });
}).post("/", sessionCheck(3), async (req, res) => {
    if (!req.body.name)
        return error(req, res, "Fail to edit department !", 400, "Missing arg");

    let department = await models.Department.findByPk(req.body.name);
    if (!department)
        return error(req, res, "Fail to edit department !", 400, "Invalid department name");

    await department.save();
    if (req.body.newName && req.body.newName !== department.name)
        await models.Department.update({name: req.body.newName}, {where: {name: req.body.name}});

    res.redirect("/admin/departments");
});

module.exports = router;
