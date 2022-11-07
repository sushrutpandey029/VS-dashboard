const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const patientSchema = new mongoose.Schema({
    DocId: {
        type: ObjectId,
        ref: "roles",
    },
    patientFullName: {
        type: String,
        required: true,
        trim: true 
      },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,
        trim:true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        match: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
        trim:true
    },
    age: {
        type: String,
    },
    nativeLanaguage: {
        type: String,
    },
    address : {
        type: String,
    },
    disabalityType:{
        type:String,
        required:true,
        enum:["Physically","Mentally"]
    },
    progress:[Object]
},{timestamps:true})

module.exports=mongoose.model("patient",patientSchema)