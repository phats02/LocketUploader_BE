const locketRouter = require("../routes/locket.route.js");

module.exports = (app) => {
    app.get("/health", (req, res) => {
        res.send("OK");
    });
    app.use("/locket", locketRouter);
};
