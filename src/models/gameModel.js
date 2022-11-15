const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const gameSchema = new mongoose.Schema({
    gamecategories: {
        type: String,
      },
    gamename: {
        type: String,
      },
    gameimage: {
        type: String,
        // required: true,
    },
    gamedescription: {
        type: String,
    },
    gamelink: {
        type: String,
    },

},{timestamps:true})

module.exports=mongoose.model("games",gameSchema)