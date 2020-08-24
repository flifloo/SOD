let express = require("express");
let router = express.Router();
let models = require("../models");

router.get("/", async (req, res) => {
  let now = new Date();
  let firstDate = await models.Data.findByPk("firstDate");

  if (firstDate && firstDate.value) {
    firstDate = new Date(firstDate.value);
    if (firstDate.getTime() < now.getTime())
      firstDate = now;
  } else
    firstDate = now;

  firstDate = firstDate.toISOString().substring(0, 10);

  res.render("index", {
    title: "SOD - Home",
    departments: await models.Department.findAll(),
    sandwiches: await models.Sandwich.findAll(),
    date: {
      firstDate: firstDate,
      lastDate: await models.Data.findByPk("lastDate")
    }
  });
});

module.exports = router;
