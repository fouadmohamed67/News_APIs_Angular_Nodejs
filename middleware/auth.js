 
const User =require('../models/user')
const jwt=require('jsonwebtoken') 
const isAuth=async (req,res,next)=>{  

    try { 
        const token=req.get('Authorization').split(' ')[1]; 
        const  decodedToken=jwt.verify(token,'fo2shaDoksha');
        const user=User.findById(decodedToken.userId);
       if(!user)
       {
        throw new Error("this user not authorized");
       } 
       req.userId=decodedToken.userId
       next();
    } catch (error) {
        res.json({ message: "this user is un authorized",status:401 });
    } 
} 
module.exports=[
    isAuth
]