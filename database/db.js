
const mongoose = require('mongoose')

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Db connected Successfully ..")
    }
    catch(e){
        console.log("MonogDb connection fail !");
        process.exit(1)
    }
}

module.exports = connectToDB;