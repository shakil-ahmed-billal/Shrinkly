import app from "./app.js";
import config from "./config/config.js";
app.get("/", (req, res) => {
    res.send("Hello World from the backend");
});
app.listen(config.PORT, () => {
    console.log(`
        Server is running on port ${config.PORT}
        http://localhost:${config.PORT}
        ${config.NODE_ENV} mode
        `);
});
//# sourceMappingURL=server.js.map