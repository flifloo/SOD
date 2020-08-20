let error = require("../routes/utils/error");

module.exports = (req, res, next) => {
    if(req.app.locals.test)
        return next();
    req.app.get("recaptcha").middleware.verify(req, res, () => {
        if (req.recaptcha.error)
            error(req, res, "Strange behaviour detected !", 400,
                req.app.get("env") !== "production" ? req.recaptcha.error : undefined);
        else
            next();
    });
};
