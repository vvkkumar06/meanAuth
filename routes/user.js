const express = require('express');
const passport =require('passport');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/db.js');
//register
router.post('/register', (req,res)=>{
   let newUser = new User({
       username: req.body.username,
       password: req.body.password,
       name: req.body.name,
       email: req.body.email
   });

   User.addUser(newUser, (err, user)=>{
        if(err){
               res.json({success: false, msg: 'Failed to register user'});
        }
        else{
              res.json({success:true, msg: 'User Registered'});
        }
   });

});

//authenticate
router.post('/authenticate', (req,res,next)=>{
   const username = req.body.username;
   const password = req.body.password;

   User.getUserByUsername(username, (err,user)=>{
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: "User not found"});
        }

        User.comparePassword(password, user.password, (err, isMatch)=>{
            if(err) throw err;
            if(isMatch){
                   const token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: 604800 //1 week
                   }); 

                   res.json({
                       success: true,
                       token: 'Bearer '+token,
                       user: {
                           id: user._id,
                           name: user.name,
                           username:user.username,
                           email: user.email
                       }
                   });

            }else{
                return res.json({
                    success: false, 
                    msg: "Wrong Password"
                });
            }
        });
   });
});

//profile
router.get('/profile', passport.authenticate('jwt', {session:false}),(req,res,next)=>{
   res.send({user: req.user});  
});


module.exports = router;
