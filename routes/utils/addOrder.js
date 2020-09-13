const models = require("../../models");
const error = require("./error");

module.exports = async (req, res, args, dateCheck = true) => {
    if (!args.department || !args.firstName || !args.lastName || args.sandwiches.length < 1 || args.dates.length < 1 ||
        args.sandwiches.length !==  args.dates.length)
        return error(req, res, "Invalid order !", 400, "Missing arguments");

    let department = await models.Department.findByPk(args.department);
    if (!department)
        return error(req, res, "Invalid order !", 400, "Invalid department");

    let user = null;
    if (args.username)
        user = await models.User.findOne({where: {username: args.username}});

    let sandwiches = [];
    let price = 0;
    for (let s in args.sandwiches) {
        if (!args.dates[s])
            return error(req, res, "Invalid order !", 400, "Sandwich without date");

        let sandwich = await models.Sandwich.findByPk(args.sandwiches[s]);
        if (!sandwich)
            return error(req, res, "Invalid order !", 400, "Invalid sandwich: "+args.sandwiches[s]);

        let date = new Date(args.dates[s]);

        if (dateCheck) {
            let [firstDate, lastDate] = [await models.Data.findByPk("firstDate"),
                await models.Data.findByPk("lastDate")];
            let now = new Date();
            now.setUTCHours(0, 0, 0, 0);

            if (firstDate && firstDate.value && lastDate && lastDate.value) {
                [firstDate, lastDate] = [new Date(firstDate.value), new Date(lastDate.value)];
                firstDate.setUTCHours(0, 0, 0, 0);
                lastDate.setUTCHours(0, 0, 0, 0);

                if (now.getTime() > date.getTime() ||
                    firstDate.getTime() > date.getTime() ||
                    lastDate.getTime() < date.getTime())
                    return error(req, res, "Invalid order !", 400, "Date not available");
            }
        }

        try {
            sandwiches.push([sandwich.name, date.toISOString().substring(0, 10)]);
        } catch {
            return error(req, res, "Invalid order !", 400, "Invalid date");
        }
        price += sandwich.price;
    }

    let order = await models.Order.create({
        firstName: args.firstName,
        lastName: args.lastName,
        paid: Boolean(args.paid),
        give: Boolean(args.give),
        price: price
    });

    if (user)
        await order.setUser(user);
    await order.setDepartment(department);

    for (let data of sandwiches)
        try {
            await models.SandwichOrder.create({OrderId: order.id, SandwichName: data[0], date: data[1]});
        } catch (e) {
            await order.destroy();
            error(req, res, "Invalid order !", 500);
            throw e;
        }

    return order;
};
