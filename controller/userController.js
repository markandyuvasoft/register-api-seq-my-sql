const db = require("../models")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth.js')

// create a main model

const User = db.users

const addUser = async (req,res) =>{

User.findOne({where:{email:req.body.email}}).then(result => {

    if(User.result === null){
        res.status(401).json({
            message: "Invalid credentials!",
        });
    }

     else if(result){
        res.status(409).json({
            message: "Email already exists!",
        });
    }else{
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(req.body.password, salt, function(err, hash){
                const user = {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email:req.body.email,
                    password: hash
                }
            
                User.create(user).then(result => {
                    res.status(201).json({
                        message: "User created successfully",
                    });
                }).catch(error => {
                    res.status(500).json({
                        message: "Something went wrong!",
                    });
                });
            });
        });
    }
}).catch(error => {
    res.status(500).json({
        message: "Something went wrong!",
    });
});

}


const addUserLogin = async (req,res) =>{
    User.findOne({where:{email: req.body.email}}).then(user => {
        if(user === null){
            res.status(401).json({
                message: "Invalid credentials!",
            });
        }else{
            bcrypt.compare(req.body.password, user.password, function(err, result){
                if(result){
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, 'itsajwttoken', function(err, token){
                        res.status(200).json({
                            message: "Authentication successful!",
                            token: token
                        });
                    });
                }else{
                    res.status(401).json({
                        message: "Invalid credentials!",
                    });
                }
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong!",
        });
    });
}


module.exports = {
    addUser,
    addUserLogin
}