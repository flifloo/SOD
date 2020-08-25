const express = require("express");
const router = express.Router();
const error = require("./utils/error");
const models = require("../models");

router.get("/", async (req, res) => {
    if (!req.query.token)
        return error(req, res, "Can't verify email", 400, "Missing args");

    let user = await models.User.findOne({where: {emailToken: req.query.token}});
    if (!user)
        return error(req, res, "Can't verify email", 400, "Invalid token");

    user.emailToken = null;
    user.emailVerified = true;
    await user.save();
    req.session.user = user;
    req.session.save(() => res.redirect("/profile"));
});

module.exports = router;
