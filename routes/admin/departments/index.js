let express = require("express");
let router = express.Router();
let sessionCheck = require("../../../middlewares/sessionCheck");
let models = require("../../../models");
let error = require("../../utils/error");


router.get("/", sessionCheck(3), async (req, res) => {
    res.render("admin/departments/index", {
        title: "SOD - Departments administration",
        departments: await models.Department.findAll()
    });
})
    .use("/edit", require("./edit"))
    .use("/add", require("./add"))
    .get("/delete", sessionCheck(3), async (req, res) => {
        if (!req.query.name)
            return error(req, res, "Can't remove department !", 400, "Missing arg");

        let department = await models.Department.findByPk(req.query.name);
        if (!department)
            return error(req, res, "Can't remove department !", 400, "Invalid department");

        await department.destroy();
        res.redirect("/admin/departments");
    });

module.exports = router;
