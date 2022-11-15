const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const gameSchema = new mongoose.Schema({
    gamecategories: {
        type: String,
        required: true,
        trim: true 
      },
    gamename: {
        type: String,
        required: true,
        trim: true 
      },
    gameimage: {
        type: String,
        // required: true,
    },
    gamedescription: {
        type: String,
        required: true,
    },
    gamelink: {
        type: String,
    },

},{timestamps:true})

module.exports=mongoose.model("games",gameSchema)