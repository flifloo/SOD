let expect = require("chai").expect;


async function wipeDatabase(models) {
    for (let model in models) {
        if (["sequelize", "Sequelize"].indexOf(model) < 0)
            await models[model].destroy({where: {}});
    }
}

async function databaseEnter() {
    let models = require("../models");
    await models.sequelize.sync();
    await wipeDatabase(models);
    return models;
}

async function databaseExit(models) {
    await wipeDatabase(models);
    await models.sequelize.close();
    delete require.cache[require.resolve("../models")];
}


describe("Database Department tests", () => {
    let models;

    before(async () => {
        models = await databaseEnter();
    });
    after(async () => {
        await databaseExit(models);
    });

    afterEach(async () => {
        await wipeDatabase(models);
    });

    it("Department creation", async () => {
        expect(await models.Department.create({name: "TestDepartment"})).to.be.instanceOf(models.Department);
    });
    it("Department validation", async () => {
        await models.Department.create({name: "TestDepartment"});
        try {
            await models.Department.create({name: "TestDepartment"});
        } catch (e) {
            if (!(e instanceof models.Sequelize.ValidationError))
                throw e;
        }
    });
});

describe("Database Sandwich tests", () => {
    let models;

    before(async () => {
        models = await databaseEnter();
    });
    after(async () => {
        await databaseExit(models);
    });

    afterEach(async () => {
        await wipeDatabase(models);
    });

    it("Sandwich creation", async () => {
        expect(await models.Sandwich.create({name: "TestSandwich", price: 1.5})).to.be.instanceOf(models.Sandwich);
    });
    it("Sandwich validation", async () => {
        await models.Sandwich.create({name: "TestSandwich", price: 1.5});
        try {
            await models.Sandwich.create({name: "TestSandwich", price: 1.5});
        } catch (e) {
            if (!(e instanceof models.Sequelize.ValidationError))
                throw e;
        }
    });
});

describe("Database User test", () => {
    let models;

    before(async () => {
        models = await databaseEnter()
    });
    after(async () => {
        await databaseExit(models);
    });

    afterEach(async () => {
        await wipeDatabase(models);
    });

    it("User creation", async () => {
        expect(await models.User.create({
            username: "test",
            email: "test@test.fr",
            firstName: "Test",
            lastName: "Test",
            passwordHash: "test"
        })).to.be.instanceOf(models.User);
    });
    it("User password", async () => {
        let testPassword = "test";
        let testUser = await models.User.create({
            username: "test",
            email: "test@test.fr",
            firstName: "Test",
            lastName: "Test",
            passwordHash: testPassword});
        expect(testUser.checkPassword(testPassword)).to.be.equal(true);
    });
    it("User validation", async () => {
        await models.User.create({
            username: "test",
            email: "test@test.fr",
            firstName: "Test",
            lastName: "Test",
            passwordHash: "test"});

        //Username
        try {
            await models.User.create({
                username: "test",
                email: "test2@test.fr",
                firstName: "Test2",
                lastName: "Test2",
                passwordHash: "test"
            })
        } catch (e) {
            if (!(e instanceof models.Sequelize.ValidationError))
                throw e;
        }

        //Email
        try {
            await models.User.create({
                username: "test2",
                email: "test@test.fr",
                firstName: "Test2",
                lastName: "Test2",
                passwordHash: "test"
            })
        } catch (e) {
            if (!(e instanceof models.Sequelize.ValidationError))
                throw e;
        }

        //First & last name
        try {
            await models.User.create({
                username: "test2",
                email: "test2@test.fr",
                firstName: "Test",
                lastName: "Test",
                passwordHash: "test"
            })
        } catch (e) {
            if (!(e instanceof models.Sequelize.ValidationError))
                throw e;
        }
    });
    it("User associations", async () => {
        let testUser = await models.User.create({
            username: "test",
            email: "test@test.fr",
            firstName: "Test",
            lastName: "Test",
            passwordHash: "test"
        }, {
            include: models.Department
        });
        let testDepartment = await models.Department.create({name: "TestDepartment"});

        await testUser.setDepartment(testDepartment);
        await testUser.reload();
        expect(testUser.Department).to.be.instanceOf(models.Department);
        expect(testUser.Department.name).to.be.equal(testDepartment.name);
    });
});

describe("Database Command tests", () => {
    let models;

    before(async () => {
        models = await databaseEnter();
    });
    after(async () => {
        await databaseExit(models);
    });

    afterEach(async () => {
        await wipeDatabase(models);
    });

    it("Command creation", async () => {
        expect(await models.Command.create({
            firstName: "Test",
            lastName: "Test",
            price: 1.5
        })).to.be.instanceOf(models.Command);
    });
    it("Command associations", async () => {
        let testCommand = await models.Command.create({firstName: "Test", lastName: "Test", price: 1.5, },
            {include: [models.Department, models.Sandwich, models.User]});
        let testDepartment = await models.Department.create({name: "TestDepartment"});
        let testSandwich = await models.Sandwich.create({name: "TestSandwich", price: 1.5});
        let testUser = await models.User.create({
            username: "test",
            email: "test@test.fr",
            firstName: "Test",
            lastName: "Test",
            passwordHash: "test"});

        await testCommand.setDepartment(testDepartment);
        await testCommand.reload();
        expect(testCommand.Department).to.be.instanceOf(models.Department);
        expect(testCommand.Department.name).to.be.equal(testDepartment.name);

        await testCommand.addSandwiches(testSandwich);
        await testCommand.reload();
        expect(testCommand.Sandwiches[0]).to.be.instanceOf(models.Sandwich);
        expect(testCommand.Sandwiches[0].name).to.be.equal(testSandwich.name);

        await testCommand.setUser(testUser);
        await testCommand.reload();
        expect(testCommand.User).to.be.instanceOf(models.User);
        expect(testCommand.User.username).to.be.equal(testUser.username);
    });
});