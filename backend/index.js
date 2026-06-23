const express = require("express")
const app = express()
require("dotenv").config()
const connectDb = require('./src/config/db')
connectDb()
const cookieParser = require('cookie-parser');
port = process.env.PORT || 5000;
const authRoutes = require("./src/routes/authRoute")
app.get("/", (req, res) => {
    res.send("Server Running");
})
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoutes);

app.listen(port, () => {
    console.log(`Listening on port no ${port}`);
})