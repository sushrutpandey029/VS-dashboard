const roleModel = require("../models/rolesModel");
const patientModel = require("../models/patientModel");
const validation = require("../validator/validator");
const Register = require("../models/registerModel");
const gameModel=require("../models/gameModel")
const bcrypt = require('bcrypt');


const game_register = async(req,res)=>{
    await gameModel.create(req.body).then(function(detail){
        // res.send(detail);
        res.redirect('/games'); 
    }).catch(e=>{
        res.send(e);
        console.log(e);
    });
}

const update_game = async (req,res)=>{
    await gameModel.updateOne({_id:req.params.id},{
        $set:{
            gamecategories:req.body.gamecategories,
            gametype:req.body.gametype,
            gamename:req.body.gamename,
            gameimage:req.body.gameimage,
            gamedescription:req.body.gamedescription,
            gamefile:req.body.gamefile
        },function(err,docs){
            if(err){
                console.log(err);
            }else{
                // console.log("updated doc :",docs);
                res.redirect('../games') 
            }
        }
    })  
}

const delete_game=async (req,res)=>{
    const ID=req.params.id;
 await gameModel.findOneAndDelete({_id:ID});
 
 res.redirect('/games') 
}

module.exports = {game_register,update_game,delete_game} 