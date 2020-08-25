let crypto = require("crypto");
let models = require("../../models");
let Message = require("emailjs").Message;
let error = require("./error");


module.exports = async (req, res, user, callBack) => {
    let token = crypto.randomBytes(16).toString("hex");
    let config = req.app.get("config");

    while (await models.User.findOne({where: {emailToken: token}}))
        token = crypto.randomBytes(16).toString("hex");
    user.emailToken = token;
    await user.save();

    req.app.get("mailClient").send( new Message({
        text: res.__("profile.emailCheckMessage", `${req.protocol}://${req.hostname}/check?token=${token}`),
        from: config.email.from,
        to: user.email,
        subject: res.__("profile.emailCheck")
    }), (err, message) => {
        if (err)
            return error(req, res, "Fail to send message !", 500,
                req.app.get("env") !== "production" ? err : undefined);
        else
            callBack();
    });
};
