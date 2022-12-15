require('dotenv').config();
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const express = require("express")
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const roleModel=require("./models/rolesModel");
const patientModel=require("./models/patientModel");
const registerModel=require("./models/registerModel");
const { default: mongoose, trusted } = require('mongoose');
const multer = require('multer'); 
const path = require("path"); 
const hbs = require('hbs');
const gameModel = require('./models/gameModel');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.text({ type: '/' }));


app.use(multer().any())


const static_path = path.join(__dirname,"../public")
const template_path = path.join(__dirname,"../templates/views")
const partial_path = path.join(__dirname,"../templates/partial")


app.use(express.static(static_path))
app.set("view engine","hbs")
app.set("views",template_path)
hbs.registerPartials(partial_path)


mongoose.connect(process.env.MONGODB_ID, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

const store = new MongoDBSession({
    uri:process.env.MONGODB_ID,
    collection:"mySessions"
}) 

const ONE_HOUR = 1000*60*60;
const ONE_DAY = ONE_HOUR*24
const SESSION_IDLE_TIMEOUT = ONE_DAY*20; //20 DAY IS IDLE TIME

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false,
    store:store,
    cookie:{
        maxAge:+SESSION_IDLE_TIMEOUT,
        sameSite:"None" //changed from secure to none.. earlier it was checking if request sending site was secure or not
    }
 })
 )
  
app.use('/', route);

app.get("/index",async(req,res) => {

   let data= await roleModel.find().sort({_id:-1})
   let data1 = await patientModel.find().sort({_id:-1})
   let data2 = await gameModel.find().sort({_id:-1})
   // res.render("doc_dashboard",{userData:data})

    res.render("index",{docData:data, patientdata:data1, gameData:data2})
})


 app.get('/register',(req,res)=>{
    res.render("register");
 })

 app.get('/login',(req,res)=>{
   res.render("login");
})

app.get('/edit-profile',(req,res)=>{
   res.render("edit-profile");
})

app.get('/admin-profile',async(req,res)=>{
   const data = await registerModel.find()
   res.render("admin-profile",{data:data});

});

app.get('/profile',(req,res)=>{
   res.render("profile");
})

app.get('/forgot-password',(req,res)=>{
   res.render("forgot-password");
})

app.get('/change-password',(req,res)=>{
   res.render("change-password");
})

app.get('/games',async(req,res)=>{
   let data = await gameModel.find()
   res.render("games",{userData:data});
})

app.get("/doctor",async(req,res)=>{
   let data = await roleModel.find()
   // console.log(data.length);
   res.render('doctor',{userData:data})
   // console.log(data)
})

app.get("/add-doctor",(req,res)=>{
   res.render('add-doctor')
})

app.get("/doc-dashboard/:id",async(req,res)=>{
   let data=await patientModel.find({DocId:req.params.id}).sort({_id:-1})
   res.render("doc_dashboard",{userData:data})
})

app.get("/patient_dashboard/:id",async(req,res)=>{
      let data=await patientModel.find({"_id":req.params.id})
      res.render("patient_dashboard",{userData:data})
})

app.get("/patients",async(req,res)=>{ // to render all the paitients 
   let data = await patientModel.find()

   res.render('patients',{userData:data})
})

app.get("/add-patient",(req,res)=>{
   res.render("add-patient")
})

app.get("/add-game",(req,res)=>{
   res.render("add-game")
})

app.get('/edit-doctor/:id',async(req,res)=>{ // api to edit doctor
   const user=await roleModel.find({"_id":req.params.id})

   res.render("edit-doctor",{userData:user})
})

app.get('/doc-profile/:id',async(req,res)=>{ // api to edit doctor
   const doc=await roleModel.find({"_id":req.params.id})
   res.render("doc-profile",{docData:doc})
})

app.get('/edit-game/:id',async(req,res)=>{
   const user=await gameModel.find({"_id":req.params.id})

   res.render("edit-game",{userData:user})
})

app.get('/edit-patient/:id',async(req,res)=>{
   const user=await patientModel.find({"_id": req.params.id})

   res.render("edit-patient",{userData:user})
})

app.get('/patients-profile/:id',async(req,res)=>{
   const user=await patientModel.find({"_id": req.params.id})

   res.render("patients-profile",{userData:user})
})

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});