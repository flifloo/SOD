let express = require("express");
let router = express.Router();

/* GET home page. */
router.post("/", (req, res) => {
    console.log(req.body);
});

module.exports = router;
