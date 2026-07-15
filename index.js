require("dotenv").config()
const express = require("express")
const app = express()

const connectDb = require('./config/db')
connectDb()
const startAppointmentExpiryScheduler = require("./utils/appointmentExpiryScheduler");
startAppointmentExpiryScheduler()

const redisClient = require("./config/redis");


const cookieParser = require('cookie-parser');
const path = require('path');

const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const { initializeSocket } = require("./config/socket")

port = process.env.PORT || 5000;

const authRoutes = require("./routes/authRoute")
const doctorRoute = require("./routes/doctorRoute")
const patientRoute = require("./routes/patientRoute")
const conversationRoute = require("./routes/conversationRoute");
const chatRoute = require("./routes/chatRoute");

app.get("/", (req, res) => {
    res.send("Server Running");
})

app.use(cookieParser());
app.use(express.json());
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use("/", authRoutes);
app.use("/doctor", doctorRoute);
app.use("/patient", patientRoute);
app.use("/api/conversation", conversationRoute);
app.use("/chat", chatRoute);
app.use(express.static(path.join(__dirname, "public")));

initializeSocket(server)

server.listen(port, async () => {
    try {
        await redisClient.connect();

        console.log("✅ Redis Connected");
        console.log(`Listening on port ${port}`);

    } catch (err) {
        console.log("Redis Connection Failed:", err);
    }
});