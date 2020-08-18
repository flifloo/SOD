function sessionCheck(permission) {
    return (req, res, next) => {
        if (!req.session.user) {
            req.session.lastUrl = req.originalUrl;
            req.session.save(() => res.redirect("/login"));
        } else if (req.session.user.permissions < permission) {
            res.status(403);
            res.render("error", {message: "Permission denied !", "error": {}});
        } else
            next();
    }
}

module.exports = sessionCheck;
