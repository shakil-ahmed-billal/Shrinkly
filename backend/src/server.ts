import app from "./app/app";
import config from "./config/config";


app.get("/", (req, res)=>{
    res.send("Hello World from the backend");
});

app.listen(config.PORT, ()=>{
    console.log(`
        Server is running on port ${config.PORT}
        http://localhost:${config.PORT}
        ${config.NODE_ENV} mode
        `);
})