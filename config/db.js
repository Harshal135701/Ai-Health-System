const mongoose = require("mongoose")

async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGODB_URl)
        console.log("mongoDB is connected")
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports=connectDb