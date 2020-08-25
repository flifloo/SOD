let request = require("supertest");
let wipeDatabase = require("./utils/wipeDatabase");
let expect = require("chai").expect;


async function setup() {
    let app = require("../app");
    let models = require("../models");
    await models.sequelize.sync();
    await wipeDatabase(models);
    return [app, models];
}

async function createTestUser(models, p) {
    await models.User.create({
        username: "test",
        email: "test@test.fr",
        firstName: "Test",
        lastName: "Test",
        passwordHash: "test",
        permissions: p ? p : 0
    });
}

async function clean() {
    await wipeDatabase(models);
    await models.sequelize.close();
    for (let e of ["../app", "../models"])
        delete require.cache[require.resolve(e)];
}

async function getLoginAgent(app) {
    let agent = request.agent(app, {});
    await agent
        .post("/login")
        .send({username: "test", password: "test"})
        .expect(302);
    return agent;
}


describe("Pages tests", () => {
    describe("Public pages test", () => {
        let app;
        let models;

        before(async () => {
            [app, models] = await setup();
        });
        after(() => {
            return clean;
        });

        it("Responds to /", (done) => {
            request(app)
                .get("/")
                .expect(200, done);
        });
        it("Responds to /login", (done) => {
            request(app)
                .get("/login")
                .expect(200, done);
        });
        it("Responds to /forget", (done) => {
            request(app)
                .get("/forget")
                .expect(200, done)
        });
        it("Responds to /register", (done) => {
            request(app)
                .get("/register")
                .expect(200, done);
        });
        it("Responds to /check", (done) => {
            request(app)
                .get("/check")
                .expect(400, done);
        });
        it("Responds to /logout", (done) => {
            request(app)
                .get("/logout")
                .expect(302, done);
        });
        it("Response to /profile", (done) => {
            request(app)
                .get("/profile")
                .expect(302, done);
        });
        it("Response to /sandwiches", (done) => {
            request(app)
                .get("/sandwiches")
                .expect(302, done);
        });
        it("Response to /orders", (done) => {
            request(app)
                .get("/orders")
                .expect(302, done);
        });
        it("Response to /admin", (done) => {
            request(app)
                .get("/admin")
                .expect(302, done);
        });
        it("Response to /admin/orders", (done) => {
            request(app)
                .get("/admin/orders")
                .expect(302, done);
        });
        it("Response to /admin/orders/date", done => {
            request(app)
                .get("/admin/orders/date")
                .expect(302, done);
        });
        it("Reponse to /admin/sandwiches", done => {
            request(app)
                .get("/admin/sandwiches")
                .expect(302, done);
        });
        it("Reponse to /admin/sandwiches/add", done => {
            request(app)
                .get("/admin/sandwiches/add")
                .expect(302, done);
        });
        it("Reponse to /admin/sandwiches/edit", done => {
            request(app)
                .get("/admin/sandwiches/edit")
                .expect(302, done);
        });
        it("Reponse to /admin/departments", done => {
            request(app)
                .get("/admin/departments")
                .expect(302, done);
        });
        it("Reponse to /admin/departments/add", done => {
            request(app)
                .get("/admin/departments/add")
                .expect(302, done);
        });
        it("Reponse to /admin/departments/edit", done => {
            request(app)
                .get("/admin/departments/edit")
                .expect(302, done);
        });
        it("404 everything else", (done) => {
            request(app)
                .get("/foo/bar")
                .expect(404, done);
        });
    });

    describe("Global logged user pages", () => {
        let app;
        let models;

        before(async () => {
            [app, models] = await setup();
            await createTestUser(models);
        });
        after(() => {
            return clean;
        });

        it("Login user", async () => {
            let res = await request(app)
                .post("/login")
                .send({username: "test", password: "test"})
                .expect(302);
            expect(res.headers.location).to.be.equal("/");
        });
        it("Login error", async () => {
            let res = await request(app)
                .post("/login")
                .send({username: "wrong", password: "wrong"})
                .expect(302);
            expect(res.headers.location).to.be.equal("/login?err=true");
        });
        it("Forget page", async () => {
            await (await getLoginAgent(app))
                .get("/forget")
                .expect(302);
        });
        it("Register page", async () => {
            await (await getLoginAgent(app))
                .get("/register")
                .expect(302);
        });
        it("Logout page", async () => {
            let agent = await getLoginAgent(app);
            await agent
                .get("/logout")
                .expect(302);

            //Check if user is correctly logout
            await agent
                .get("/login")
                .expect(200);
        });
        it("Profile page", async () => {
            await (await getLoginAgent(app))
                .get("/profile")
                .expect(200);
        });
    });

    describe("Permissions pages tests", () => {
        for (let [p, a] of Object.entries({
            0: [403, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
            1: [200, 403, 403, 403, 403, 403, 403, 403, 403, 403, 403],
            2: [200, 200, 403, 403, 403, 403, 403, 403, 403, 403, 403],
            3: [200, 200, 200, 200, 200, 200, 200, 400, 200, 200, 400]
        }))
            describe(`Permission ${p} pages`, () => {
                let app;
                let models;

                before(async () => {
                    [app, models] = await setup();
                    await createTestUser(models, p);
                });
                after(() => {
                    return clean;
                });

                it("Sandwiches page", async () => {
                    await (await getLoginAgent(app))
                        .get("/sandwiches")
                        .expect(a[0]);
                });
                it("Orders page", async () => {
                    await (await getLoginAgent(app))
                        .get("/orders")
                        .expect(a[1]);
                });
                it("Admin page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin")
                        .expect(a[2]);
                });
                it("Orders administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/orders")
                        .expect(a[3]);
                });
                it("Orders date administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/orders/date")
                        .expect(a[4])
                });
                it("Sandwiches administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/sandwiches")
                        .expect(a[5])
                });
                it("Sandwiches add administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/sandwiches/add")
                        .expect(a[6])
                });
                it("Sandwiches edit administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/sandwiches/edit?name=test")
                        .expect(a[7])
                });
                it("Departments administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/departments")
                        .expect(a[8])
                });
                it("Departments add administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/departments/add")
                        .expect(a[9])
                });
                it("Departments edit administration page", async () => {
                    await (await getLoginAgent(app))
                        .get("/admin/departments/edit?name=test")
                        .expect(a[10])
                });
            });
    });
});
