const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const progressSchema = new mongoose.Schema({
    
    gamebase:{
        type:String,
    },
    
    gameId:{
        type:String,
    },
  
    patientId:{
        type:String,
        required: true,
    },

    
    overralrating:{
        type:String,
    },

    date:{
        type:String,
    },

    elapsedTime:{
        type:String,
    },

    LoudnessTarget:{
        type:String,
    },

    NumberOfTrials:{
        type:String,
    },


    cumulativeDurationOfSounds:{
        type:String,
    },


    MeanPitch:{
        type:String,
    },

    meanLoudness:{
        type:String,
    },

    stdDevPitch:{
        type:String,
    },

    stdDevLoudness:{
        type:String,
    },

    rangepitchMin:{
        type:String,
    },

    rangepitchMax:{

        type:String,
    },

    rangeLoudnessMin:{
        type:String,
    },

    rangeLoudnessmax:{
        type:String,
    },

    audioId:{
        type:String,
    },


},{timestamps:true})

module.exports=mongoose.model("progress",progressSchema)