require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const authRouter = require("./routers/user.router");
const invoiceRouter = require("./routers/invoice.router");
const path = require("path");

const _dirname = path.dirname("");
const build_path = path.join(_dirname, "../frontend/dist");
app.use(express.static(build_path));

app.use(cors({
    origin: "http://52.55.187.171:3000",
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/admin/invoice", invoiceRouter);
// Catch-all to handle SPA routing (React Router)
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

module.exports = app;