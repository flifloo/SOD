let express = require("express");
let router = express.Router();


router.get("/", async (req, res) => {
    res.render("about", {title: "SOD - About"});
});

module.exports = router;
