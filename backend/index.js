const express = require("express")
const app = express()
require("dotenv").config()
const connectDb=require('./src/config/db')
connectDb()
port = process.env.PORT || 5000;

app.get("/",(req,res)=>{
    res.send("The new project is started")
})

app.listen(port, () => {
    console.log(`Listening on port no ${port}`);
})