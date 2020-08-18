let request = require("supertest");


describe("Public pages test", () => {
    let app;
    let models;

    before(async () => {
        app = require("../app");
        models = require("../models");
        await models.sequelize.sync();
    });
    after( async () => {
        await models.sequelize.close();
        for (let e of ["../app", "../models"])
            delete require.cache[require.resolve(e)];
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
    it("Responds to /register", (done) => {
        request(app)
            .get("/register")
            .expect(200, done);
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
    it("Response to /commands", (done) => {
        request(app)
            .get("/commands")
            .expect(302, done);
    });
    it("Response to /admin", (done) => {
        request(app)
            .get("/admin")
            .expect(302, done);
    });
    it("Response to /admin/commands", (done) => {
        request(app)
            .get("/admin/commands")
            .expect(302, done);
    });
    it("404 everything else", (done) => {
        request(app)
            .get("/foo/bar")
            .expect(404, done);
    });
});
