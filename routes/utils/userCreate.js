let models = require("../../models");
let error = require("../utils/error");
let emailCheck = require("./emailCheck");


module.exports = async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.firstName || !req.body.lastName ||
        !req.body.department || !req.body.password)
        return error(req, res, "Invalid register !", 400, "Missing args");

    if (await models.User.findByPk(req.body.username))
        return error(req, res, "Invalid register !", 400, "Username already taken");

    if (await models.User.findOne({where: {firstName: req.body.firstName,
            lastName: req.body.lastName}}))
        return error(req, res, "Invalid register !", 400, "First & last name already register");

    if (await models.User.findOne({where: {email: req.body.email}}))
        return error(req, res, "Invalid register !", 400, "Email already used");

    let department = await models.Department.findByPk(req.body.department, {where: {enable: true}});
    if (!department)
        return error(req, res, "Invalid register !", 400, "Invalid department");

    try {
        let user = await models.User.create({
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            passwordHash: req.body.password
        });

        await user.setDepartment(department);

        for (let c of await models.Order.findAll({where: {
                firstName: user.firstName,
                lastName: user.lastName,
                UserUsername: null
            }}))
            await c.setUser(user);

        if (!req.app.locals.test) {
            new Promise(async done => await emailCheck(req, res, user, done));
            await user.reload();
        }

        return user;
    } catch (e) {
        error(req, res, "Registration fail !");
        throw e;
    }
};
