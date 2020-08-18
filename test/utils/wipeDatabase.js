async function wipeDatabase(models) {
    for (let model in models) {
        if (["sequelize", "Sequelize"].indexOf(model) < 0)
            await models[model].destroy({where: {}});
    }
}

module.exports = wipeDatabase;
