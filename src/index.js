//middle ware can be created to handle url verifications
//currently working for doctor only, create a middleware to find each and every role..


require('dotenv').config();
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const express = require("express")
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const roleModel=require("./models/rolesModel");
const patientModel=require("./models/patientModel");
const registerModel=require("./models/registerModel");
const progressModel = require('./models/progressModel');
const { default: mongoose, trusted } = require('mongoose');
const multer = require('multer'); 
const path = require("path"); 
const hbs = require('hbs');
const gameModel = require('./models/gameModel');
let cookieParser = require('cookie-parser');
const app = express(); 

app.use(cookieParser());
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
    saveUninitialized:true,
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
   let datag= await roleModel.find().sort({createdAt:1})
   let data1 = await patientModel.find().sort({_id:-1})
   let datap = await patientModel.find().sort({createdAt:1})
   let data2 = await gameModel.find().sort({_id:-1})
   const temp=req.cookies.id;
   const user=await registerModel.find({_id:temp}); //checking if id logged in is of admin or not..
   // doctor as an admin condition is not handled
   var array=[]
   datag.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      array.push(iso.split("T")[0])
   })

   var array2=[]
   datap.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      array2.push(iso.split("T")[0])
   })

   if(user.length>0)res.render("index",{docData:data,patientdata:data1, gameData:data2,graphDataDoc:array,graphDataPatient:array2}) //if found to be of admin then return else invalid
   else res.send("authorization invalid");
})


 app.get('/register',(req,res)=>{


    res.render("register");
 })

 app.get('/login',(req,res)=>{
   
   res.render("login");
})



app.get('/', (req, res) => {
   // Check if the user is logged in
   const isLoggedIn = req.session.user;
 
   // Render the header template and pass the login data to it
   res.render('header', { user: req.session.user });
 });

// app.get('/logout',(req,res)=>{ // at the time of logout clearing the cookie
//    res.clearCookie("id");

//    return res.render("login")
// })

app.get('/logout', (req, res) => {
  
      res.redirect('../login');
   
 });







app.get('/edit-profile',async(req,res)=>{
   const temp= req.cookies.id;
   const data=await registerModel.find({_id:temp})
   res.render("edit-profile",{userData:data});
})

app.get('/admin-profile',async(req,res)=>{
   const temp= req.cookies.id;
   const data=await registerModel.find({_id:temp})
   if(data.length>0)res.render("admin-profile",{data:data});
   else res.send("access not provided")
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

app.get('/game_categorie/:category',async(req,res)=>{
   let data = await gameModel.find({gamecategories:req.params.category})
   res.render("games",{userData:data});
})

app.get('/games',async(req,res)=>{
   let data =await gameModel.find()
   var temp=[];
   data.forEach(element => {
      temp.push(element.gamecategories);
   }); 
   function removeDuplicates(temp) {
      return temp.filter((item, 
          index) => temp.indexOf(item) === index);
  }
 let newdata=removeDuplicates(temp);
  res.render("categories",{userData:newdata})
})

app.get("/doctor",async(req,res)=>{
   let exist=await roleModel.find({_id:req.cookies.id})
   let data= await roleModel.find().sort({_id:1})
   let datag= await roleModel.find().sort({_id:1})

   var array=[]
   datag.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      array.push(iso.split("T")[0])
   })
   if(exist.length>0)res.send("admin login required")
   else res.render('doctor',{userData:data,graphDataDoc:array})
})

app.get("/doctor_login",(req,res)=>{
   res.render("doctor_login")
})

app.get("/add-doctor",(req,res)=>{
   res.render('add-doctor')
})

app.get("/doc-dashboard/:id",async(req,res)=>{
   let docdata =await roleModel.find({_id:req.params.id}).sort({_id:-1})

   let data=await patientModel.find({DocId:req.params.id}).sort({_id:-1})

   let datap=await patientModel.find({DocId:req.params.id}).sort({_id:1})

   var array=[]
   datap.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      array.push(iso.split("T")[0])
   })
   res.render("doc_dashboard",{userData:data,graphData:array,dacdata:docdata})
})


app.get("/doc_maindashboard/:id",async(req,res)=>{
   let docdata =await roleModel.find({_id:req.params.id}).sort({_id:-1})

   let data=await patientModel.find({DocId:req.params.id}).sort({_id:-1})

   let datap=await patientModel.find({DocId:req.params.id}).sort({_id:1})

   var array=[]
   datap.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      array.push(iso.split("T")[0])
   })
   res.render("doc_maindashboard",{userData:data,graphData:array,dacdata:docdata})
})



app.get("/patient_dashboard/:id",async(req,res)=>{
      let data=await progressModel.find({"patientId":req.params.id})
      res.render("patient_dashboard",{userData:data})
})

app.get("/patients",async(req,res)=>{ // to render all the paitients 
   let data = await patientModel.find()
   let exist=await roleModel.find({_id:req.cookies.id})
   let datap = await patientModel.find().sort({_id:1})
   let Data = await patientModel.find({DocId:req.cookies.id});
   var array2=[]
   datap.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      array2.push(iso.split("T")[0])
   })
   if(exist.length>0)res.render('patients',{userData:Data})
   else res.render('patients',{userData:data,graphDataPatient:array2})
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


// app.get('/patients-profile/:id',async(req,res)=>{
//    const user=await patientModel.find({"_id": req.params.id})

//    res.render("patients-profile",{userData:user})
// })

app.get('/patients-profile/:id',async(req,res)=>{
   const data=await patientModel.find({"_id": req.params.id});
   const gameData=await progressModel.find({"patientId":req.params.id}).sort({patientId:1})
   // console.log(gameData)
   var array2=[]
   var mpl=new Map();
   var mpp=new Map();
   var mpo=new Map();
   var arrl=[];
   var aloud=[];
   var arrp=[];
   var apitch=[];
   var arro=[];
   var aover=[];

   gameData.map(ob =>{
      let iso=new Date(ob.createdAt).toISOString();
      iso=iso.split("T")[0];
      
      if(ob.gamebase=='Loudness'){
         mpl[iso]=mpl[iso] || []
         mpl[iso].push(parseFloat(ob.overralrating))
      }else if(ob.gamebase=='Frequency'){
         mpp[iso]=mpp[iso] || []
         mpp[iso].push(parseFloat(ob.overralrating))
      }else if(ob.gamebase=='Recogintion'){
         mpo[iso]=mpo[iso] || []
         mpo[iso].push(parseFloat(ob.overralrating))
      } 
      array2.push(iso)
   })

   for(var m in mpl){
      var sum=0;
      aloud.push(m);
      for(var k=0;k<mpl[m].length;k++){
         sum+= Math.abs(mpl[m][k]);
      } 
      arrl.push(sum/mpl[m].length);
   }

   for(var m in mpp){
      var sum=0;
      apitch.push(m);
      for(var k=0;k<mpp[m].length;k++){
         sum+= Math.abs(mpp[m][k]);
      }
      arrp.push(sum/mpp[m].length);
   }

   for(var m in mpo){
      var sum=0;
      aover.push(m);
      for(var k=0;k<mpo[m].length;k++){
         sum+= Math.abs(mpo[m][k]);
      }
      arro.push(sum/mpo[m].length);
   }

   res.render("progress",{userData:data,progress:gameData,graphDataPatient:array2,loudness:arrl,datel:aloud,pitch:arrp,datep:apitch,overrall:arro,dateo:aover});
});



// app.get("/user",async(req,res)=>{
//    var temp=req.cookies.id;
//    var data=await registerModel.find({_id:temp})
//    if(data.length ==0){
//       res.send("Doctor");
//    }
//    res.send("Admin")
// });

app.get("/doc_detail_profile/:_id",async(req,res)=>{

   const data = await roleModel.find({"_id":req.params._id});

   res.render("doc_detail_profile",{docdata:data})
})


app.get("/user_detailprofile/:_id",async(req,res)=>{

   const datauser = await patientModel.find({"_id":req.params._id});

   res.render("user_detailprofile",{datauser:datauser})
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});