const roleModel = require("../models/rolesModel");
const patientModel = require("../models/patientModel");
const validation = require("../validator/validator");
const bcrypt = require('bcrypt');

const authUser = (req,res,next)=>{
    try{
        if(req.user == null){
            return res.status(403).send("You need to sign in")
        }
        next();
    }

    catch(error){
        return res.status(500).send({status:false,message:error.message})
    }
}

function authRole(role){
    return (req,res,next)=>{
        if(req.user.role === "Admin"){
            next();
        }

        else if(req.user.role === "Sub-Admin"){

            for(let i = 0;i <req.user.patientData.length;i++){
            if(req.user._id ===req.user.patientData[i].DocId ){
                next();   
            }
        }
            return res.status(403).send("You don't have access to ths field")
        }

        else{
            return res.status(403).send("You don't have access to ths field")
        }
    }
}
module.exports = {authUser,authRole}