
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },
    password : {
        type : String,
        required : true,
        minLength : [8,"password must be atleast 8 characters !"]
    },
    role : {
        type : String,
        enum : ['user','admin'],
        default : 'user'
    }
},{timestamps : true,versionKey : false})

module.exports = mongoose.model('User',UserSchema);