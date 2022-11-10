const express = require("express")
const session = require("express-session")
const router = express.Router()

router.get('/',(req,res)=>{
console.log(req.session); 
req.session.isAuth=true;
res.send("Session")
})

const roleController = require("../controller/roleController")
const patientController = require("../controller/patientController")
const {authUser,authRole}=require("../controller/adminController")

router.post("/docregister",roleController.createUser)
router.post("/login",roleController.login)

router.post("/createPatient",patientController.createPatient)
router.get("/findPatient",patientController.findPatient)
router.get("/docPatient",patientController.docPatient)
router.get("/gameHistory",patientController.gameHistory)
router.get("/zipfile",patientController.zipfile)
router.get("/gameData",patientController.gameData)
router.post("/storeData",patientController.storeData)
//router.get("/admin",adminController.admin)
module.exports = router