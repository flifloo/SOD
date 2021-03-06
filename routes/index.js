let express = require("express");
let router = express.Router();
let models = require("../models");

router.get("/", async (req, res) => {
  let now = new Date();
  now.setDate(now.getDate()+1);
  let [firstDate, lastDate] = [await models.Data.findByPk("firstDate"),
    await models.Data.findByPk("lastDate")];

  if (firstDate && lastDate && firstDate.value && lastDate.value) {
    lastDate = lastDate.value;
    firstDate = new Date(firstDate.value);

    if (firstDate.getTime() < now.getTime())
      firstDate = now;
  } else
    firstDate = now;

  firstDate = firstDate.toISOString().substring(0, 10);

  res.render("index", {
    title: "SOD - Home",
    departments: await models.Department.findAll({where: {enable: true}}),
    sandwiches: await models.Sandwich.findAll({where: {enable: true}}),
    date: {
      firstDate: firstDate,
      lastDate: lastDate
    }
  });
});

module.exports = router;
