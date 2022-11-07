const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
    try {
        let token = req.headers["Authentication"];
        if (!token) {
            return res.staus(400).send({ status: false, message: "Please login" })
        }

        let decodedToken = jwt.compare(token,process.env.SECRET_KEY);
        
        

        if (!decodedToken) {
            return res.status(401).send({ status: false, messgage: "You don't have an access to this service" });
        }

        req[userId] = decodedToken.userId;
        if(req.session.isAuth){
            next();
        }
        else{
            return res.status(401).send("You don't have an access to this service")
        }
    }

    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { authentication }