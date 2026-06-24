const express = require("express")
const app = express()

require("dotenv").config()

const connectDb = require('./src/config/db')
connectDb()

const cookieParser = require('cookie-parser');

port = process.env.PORT || 5000;

const authRoutes = require("./src/routes/authRoute")
const doctorRoute=require("./src/routes/doctorRoute")
const patientRoute=require("./src/routes/patientRoute")

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.use(cookieParser());
app.use(express.json());

app.use("/", authRoutes);
app.use("/doctor",doctorRoute);
app.use("/patient",patientRoute);

app.listen(port, () => {
    console.log(`Listening on port no ${port}`);
})