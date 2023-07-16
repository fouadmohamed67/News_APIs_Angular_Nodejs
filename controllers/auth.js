const User=require('../models/user')
const {validationResult}=require('express-validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')


const signUp=(req,res)=>{
    const errors=validationResult(req) 
    if(!errors.isEmpty())
    {
        return res.json({
            status:403,
            message:'validation failed',
            errors: errors.array()
             })
       
        
    }
    const email=req.body.email
    const name=req.body.name
    const password=req.body.password
    bcrypt.hash(password,12)
    .then(hashedPassword=>{
        const user=new User({
            email:email,
            password:hashedPassword,
            name:name
        })
        return user.save() 
    })
    .then(result=>{
        res.status(201).json({message:'one user created',userId:result._id})
    })
    .catch(err=>{
        return err
    })

}
const stillLogin=(req,res)=>{ 
    try { 
        const token=req.get('Authorization').split(' ')[1]; 
        const  decodedToken=jwt.verify(token,'fo2shaDoksha');
        const user=User.findById(decodedToken.userId);
       if(!user)
       {
        throw new Error("this user not authorized");
       } 
       res.json({message:'valid token',status:200})
    } catch (error) {
        res.json({ message: "this user is un authorized",status:401 });
    }  
   
}
const login=(req,res)=>{
    let foundedUser;
    const email=req.body.email;
    const password=req.body.password;
    User.findOne({email:email})
    .then(user=>{ 
        if(!user)
        {
            const error=new Error()
            error.message='user not found'
            error.status=401;
            throw error;
        }
        foundedUser=user
       return bcrypt.compare(password,user.password)
    })
    .then(passwordIsRight=>{
        
        if(!passwordIsRight)
        {
            const error=new Error()
            error.message='password and email does not match'
            error.status=401;
            throw error; 
        }
        const token=jwt.sign(
            {email:foundedUser.email,
            userId:foundedUser._id.toString()},
        'fo2shaDoksha',
        {expiresIn:'1h'});

        res.status(200).json({token:token,userId:foundedUser._id.toString()})
    })
    .catch(err=>{
        if(!err.status)
        {
            err.status=500
        }
        return res.json(err)
    })
}

module.exports={
    signUp,
    login,
    stillLogin
}