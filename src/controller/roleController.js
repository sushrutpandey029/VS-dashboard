const roleModel = require("../models/rolesModel");
const patientModel = require("../models/patientModel");
const validation = require("../validator/validator");
const bcrypt = require('bcrypt');
const aws = require("../aws/aws")


const jwt = require("jsonwebtoken");

const createUser = async function (req, res) {
    try {
        let body = req.body

        if (!validation.isrequestBody(body)) {
            return res.status(400).send({ status: false, msg: "Invalid parameters, please provide user details" })
        }

        const { fullname, email, phone, password, role, payment, patientId } = body

        if (!validation.isValid(fullname)) {
            return res.status(400).send({ status: false, msg: "please provide full name" })

        }
        if (!validation.isValid(email)) {
            return res.status(400).send({ status: false, msg: "please provide email" })

        }

        if (!validation.isValid(phone)) {
            return res.status(400).send({ status: false, msg: "please provide phone" })

        }

        if (!validation.isValid(password)) {
            return res.status(400).send({ status: false, msg: "please provide password" })

        }

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: "email is not valid" })

        }

        if (!(/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, message: "Mobile Number is not valid" })

        }

        let isDuplicateEmail = await roleModel.findOne({ email });
        if (isDuplicateEmail) {
            res.redirect("/createUser")
        }

        let duplicatephone = await roleModel.findOne({ phone });
        if (duplicatephone) {
            return res.status(400).send({ status: false, msg: "phone is already in use" })
        }

        // generate salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        body.password = await bcrypt.hash(body.password, salt);

        if (role == "Admin") {
            let duplicateAdmin = await roleModel.findOne({ role: "Admin" })
            if (duplicateAdmin) {
                return res.status(400).send({ status: false, msg: "Admin Already Present!!! Only one admin can exist" })
            }
        }

        

        const output = await roleModel.create(body)
        
        return res.status(201).send({ status: true, msg: "User Succesfully Created", data: output })

    }
    catch (error) {
        console.log(error.message)
        return res.status(500).send({ status: false, message: error.message });
    }

}

const login = async (req, res) => {
    try {
        let body = req.body;

        if (!validation.isrequestBody(body)) {
            return res.status(400).send({ status: false, message: "Please fill the required entries" });
        }

        const { email, password } = body;

        if (!validation.isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter email id " })
        }

        if (!validation.isValid(password)) {
            return res.status(400).send({ status: false, message: "Please enter password" })
        }

        if (!(/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: "email is not valid" })

        }

        const user = await roleModel.findOne({ email });

        if (user) {
           
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                res.status(400).send({ status: false, msg: "Invalid Password" });
            }
        } else {
            res.status(401).send({ status: false, msg: "User does not exist" });
        }

        req.user = user;

        const token = jwt.sign({
            userid: user._id.toString(),
            iat: Math.floor(Date.now() / 1000),
        },process.env.SECRET_KEY)
        
        console.log(token)
        res.setHeader("Authentication", token) // Setting key Value pair of Token
        

        const output = {
            userId: user._id,
            token: token
        }
        
        // req.session.isAuth=true;
        return res.status(200).send({ status: true, msg: "User login successfull", data: output })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
    
}
module.exports = { createUser, login }

