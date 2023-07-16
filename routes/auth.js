const express=require('express')
const router=express.Router()
const authController=require('../controllers/auth')
const {body}=require('express-validator')
const User=require('../models/user')




router.put('/signUp',[
    body('email')
    .isEmail()
    .withMessage('enter a valid email')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(user=>{
            if(user)
            {
                return Promise.reject('Email in use')
            }
        })
    }),
    body('password').trim().isLength({min:6}),
    body('name').trim().not().isEmpty()
],authController.signUp)

router.post('/login',authController.login)
router.get('/ChekToken',authController.stillLogin)

module.exports=router