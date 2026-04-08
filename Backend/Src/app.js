// Backend/src/app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: true, 
    credentials: true
}));


const authRouter = require("./routes/auth.route");
const songRouter = require("./routes/song.route");


app.use("/api/auth", authRouter);
app.use("/api/song", songRouter);



const frontendPath = path.join(__dirname, "../../Frontend/dist");
app.use(express.static(frontendPath));

app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;