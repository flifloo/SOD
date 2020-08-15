let express = require("express");
let router = express.Router();
let models = require("../models");

router.get("/", async (req, res) => {
  let departments = await models.Department.findAll();
  let sandwichs = await models.Sandwich.findAll();
  res.render("index", { title: "SOD", departments: departments, sandwichs: sandwichs });
});

module.exports = router;
