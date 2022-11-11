require('dotenv').config();
const session = require("express-session");
const MongoDBSession = require("connect-mongodb-session")(session);
const express = require("express")
const bodyParser = require('body-parser');
const route = require('./routes/routes');
const { default: mongoose, trusted } = require('mongoose');
const multer = require('multer');  
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(multer().any())


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
        sameSite:trusted
    }
 })
 );
  
app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});