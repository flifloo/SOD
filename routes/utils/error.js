module.exports = (req, res, message, status, subMessage) => {
    res.status(status || 500);
    res.render("error", {user: req.session.user, message: message, error: {status: subMessage || undefined}});
};
