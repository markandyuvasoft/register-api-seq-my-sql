const db = require("../models")
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth.js')

// create a main model

const User = db.users


// 1. register api....
const addUser = async (req,res) =>{

    try {
        User.findOne({where:{email:req.body.email}}).then(result => {
            
            if(User.result === null){
                res.status(401).json({
                    message: "Invalid credentials!",
                });
            }
             else if(result){
                res.status(400).json({
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
        
    } catch (error) {

        res.status(400).send("error")
        
    }



}

// 2. login api.....
const addUserLogin = async (req,res) =>{

    try {

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
    } catch (error) {
        res.status(400).send("error")
        
    }

    
}


// 3. get all users....
const getAllUsers =  async (req,res) =>{

    try {
        
        let users = await User.findAll({})

        if(users){

            res.status(200).send(users)
        }else{
            res.status(400).send({message:"no data found"})

        }
    } catch (error) {
        res.status(400).send("no data found")
        
    }
}


// 4. get single user
const getOneUser =  async (req,res) =>{

    try {

        let id = req.params.id
        let user = await User.findOne({ where: { id:id }})

        if(user){

            res.status(200).send(user)
        }else{
            res.status(400).send({message:"no data found"})
        }
    } catch (error) {
        res.status(200).send("no data found")
    }

}

// 5. delete user
const deleteUser =  async (req,res) =>{

    try {
        let id = req.params.id

        let data = await User.findOne({ where: { id:id }})

        if(data){

            let user = await User.destroy({ where: { id:id }})
        
            res.status(200).send({message:'user is deleted'})
        }else{

            res.status(400).send({message:'user not found'})

        }
    
    } catch (error) {
        res.status(400).send("error") 
    }


}


// 6. update user
const updateUser =  async (req,res) =>{

    try {
        let id = req.params.id

        let user = await User.findOne({ where: { id:id }})
    
      if(user){
    
        User.findOne({where:{first_name:req.body.first_name}}).then(result => {

            if(result){
                res.status(400).json({
                    message: "first_name already exists!",
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
                        if(user){
                         User.update(req.body, { where: { id:id }})
                         res.status(201).json({
                            message: "User Updated successfully",
                        });
                        }else{
                            res.status(400).send("error")
                        }
                    });
                });
            }
        })
      } else{
        res.status(400).send({message:"user not found"})
      }
    } catch (error) {
        res.status(400).send("error") 
        
    }
}

module.exports = {
    addUser,
    addUserLogin,
    getAllUsers,
    getOneUser,
    deleteUser,
    updateUser
}