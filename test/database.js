let chai = require("chai");
chai.use(require("chai-as-promised"));
let expect = chai.expect;
let wipeDatabase = require("./utils/wipeDatabase");


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

describe("Database objects tests", () => {
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
            return expect(models.Department.create({name: "TestDepartment"})).to.be.rejectedWith(models.Sequelize.ValidationError);
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
            return expect(models.Sandwich.create({
                name: "TestSandwich",
                price: 1.5
            })).to.be.rejectedWith(models.Sequelize.ValidationError);
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
                passwordHash: testPassword
            });
            expect(testUser.checkPassword(testPassword)).to.be.equal(true);
        });
        it("User validation", async () => {
            await models.User.create({
                username: "test",
                email: "test@test.fr",
                emailToken: "Keyboard Cat",
                firstName: "Test",
                lastName: "Test",
                passwordHash: "test",
                passwordToken: "Keyboard Cat"
            });

            return Promise.all([
                //Username
                expect(models.User.create({
                    username: "test",
                    email: "test2@test.fr",
                    firstName: "Test2",
                    lastName: "Test2",
                    passwordHash: "test"
                })).to.be.rejectedWith(models.Sequelize.ValidationError),
                //Email
                expect(models.User.create({
                    username: "test2",
                    email: "test@test.fr",
                    firstName: "Test2",
                    lastName: "Test2",
                    passwordHash: "test"
                })).to.be.rejectedWith(models.Sequelize.ValidationError),
                //First & last name
                expect(models.User.create({
                    username: "test2",
                    email: "test2@test.fr",
                    firstName: "Test",
                    lastName: "Test",
                    passwordHash: "test"
                })).to.be.rejectedWith(models.Sequelize.ValidationError),
                //Email token
                expect(models.User.create({
                    username: "test2",
                    email: "test2@test.fr",
                    emailToken: "Keyboard Cat",
                    firstName: "Test2",
                    lastName: "Test2",
                    passwordHash: "test"
                })).to.be.rejectedWith(models.Sequelize.ValidationError),
                //Password token
                expect(models.User.create({
                    username: "test2",
                    email: "test2@test.fr",
                    firstName: "Test2",
                    lastName: "Test2",
                    passwordHash: "test",
                    passwordToken: "Keyboard Cat"
                })).to.be.rejectedWith(models.Sequelize.ValidationError)
            ])
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

    describe("Database Order tests", () => {
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

        it("Order creation", async () => {
            expect(await models.Order.create({
                firstName: "Test",
                lastName: "Test",
                price: 1.5
            })).to.be.instanceOf(models.Order);
        });
        it("Order associations", async () => {
            let testOrder = await models.Order.create({firstName: "Test", lastName: "Test", price: 1.5,},
                {include: [models.Department, models.Sandwich, models.User]});
            let testDepartment = await models.Department.create({name: "TestDepartment"});
            let testSandwich = await models.Sandwich.create({name: "TestSandwich", price: 1.5});
            let testUser = await models.User.create({
                username: "test",
                email: "test@test.fr",
                firstName: "Test",
                lastName: "Test",
                passwordHash: "test"
            });

            await testOrder.setDepartment(testDepartment);
            await testOrder.reload();
            expect(testOrder.Department).to.be.instanceOf(models.Department);
            expect(testOrder.Department.name).to.be.equal(testDepartment.name);

            await testOrder.addSandwiches(testSandwich);
            await testOrder.reload();
            expect(testOrder.Sandwiches[0]).to.be.instanceOf(models.Sandwich);
            expect(testOrder.Sandwiches[0].name).to.be.equal(testSandwich.name);

            await testOrder.setUser(testUser);
            await testOrder.reload();
            expect(testOrder.User).to.be.instanceOf(models.User);
            expect(testOrder.User.username).to.be.equal(testUser.username);
        });
    });

    describe("Database Data tests", () => {
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

        it("Data creation", async () => {
            expect(await models.Data.create({
                key: "test",
                value: "test"
            })).to.be.instanceOf(models.Data);
        });
        it("Data validation", async () => {
            await models.Data.create({key: "test", value: "test"});
            return expect(models.Data.create({
                key: "test",
                value: "test"
            })).to.be.rejectedWith(models.Sequelize.ValidationError);
        })
    });
});
