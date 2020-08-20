let express = require("express");
let router = express.Router();
let models = require("../models");

router.get("/", async (req, res) => {
  let departments = await models.Department.findAll();
  let sandwiches = await models.Sandwich.findAll();
  res.render("index", { title: "SOD - Home", departments: departments, sandwiches: sandwiches });
});

module.exports = router;
