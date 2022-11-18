const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const progressSchema = new mongoose.Schema({
    ClientId: String,
    GameName:String,
    patientId:{
        type:String,
        required: true,
    },
    NumberOfTrials:{
        type:String,
    },
    overralrating:{
        type:String,
    },
    Settings: {
       LoudnessTarget:{
        MinLoudnessTarget :{type :Number},
        MinLoudnessTarget :{type:Number}
       }
    },
    Date: Date,
    Measurements:{
        cumulativeDurationOfSounds: Number,

    },
  
    AcousticData:{
        Pitch:{
            MeanPitch :Number,
            stdDevPitch:Number,
            Range: {
                rangepitchMin :{type :Number},
                rangepitchMax :{type:Number}
            }
        },

        Loudness:{
            meanLoudness:Number,
            stdDevLoudness:Number,
            Range: {
                rangeLoudnessMin :{type :Number},
                rangeLoudnessmax  :{type:Number}
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