const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true
    },
    isAdmin:{
        type:String,
        default:true
    }
})

const Register = new mongoose.model("register",AdminSchema);
module.exports = Register
