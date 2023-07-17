const express=require('express')
const router=express.Router()
const {body}=require('express-validator')
const isAuth=require('../middleware/auth')
const feedController=require('../controllers/feed')

router.delete('/post/:id',isAuth,feedController.deletePost)
router.put('/post/:id',isAuth,feedController.updatePost)
router.get('/post/:id',isAuth,feedController.getPost)
router.get('/posts',isAuth,feedController.getPosts)
router.post('/post',[
    body('title').trim().isLength({min:5}),
    body('content').trim().isLength({min:5}),
    
],isAuth,feedController.createPost)
module.exports=[router]