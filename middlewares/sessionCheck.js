let error = require("../routes/utils/error");

function sessionCheck(permission) {
    return (req, res, next) => {
        if (!req.session.user) {
            req.session.lastUrl = req.originalUrl;
            req.session.save(() => res.redirect("/login"));
        } else if (req.session.user.permissions < permission)
            return error(req, res, "Permission denied !", 403);
        else
            next();
    }
}

module.exports = sessionCheck;
