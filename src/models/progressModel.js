const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const progressSchema = new mongoose.Schema({
    ClientId: String,
    GameName:String,
    patientId:{
        type:String,
        required: true,
    },
    Settings: {
       LoudnessTarget:{
        MinLoudnessTarget :{type :Number},
        MinLoudnessTarget :{type:Number}
       }
    },
    Date: Date,
    Counts : {
        NumberOfTrials:Number,
    },
    Measurements:{
        Total: Number,
        Below : Number,
        WithIn:Number,
        Above:Number
    },
    AcousticData:{
        Pitch:{
            Mean:Number,
            StdDev:Number,
            Range: {
                min :{type :Number},
                max :{type:Number}
            }
        },

        Loudness:{
            Mean:Number,
            StdDev:Number,
            Range: {
                min :{type :Number},
                max :{type:Number}
            }
        },
        DurationOfSuccessfullAttempt:{
            Last:Number,
            Mean:Number,
            StdDev:Number,
            Range: {
                min :{type :Number},
                max :{type:Number}
            }
        }
    }


},{timestamps:true})

module.exports=mongoose.model("progress",progressSchema)