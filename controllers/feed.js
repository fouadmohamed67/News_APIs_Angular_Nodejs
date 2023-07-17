const {validationResult}=require('express-validator')
const Post=require('../models/post')
const fs=require('fs')
const path=require('path')
const User=require('../models/user')



const getPosts=async (req,res,next)=>{ 
    const currentPage=req.query.page || 1
    const postsPerPage=2 
   try {
    const totalItems= await Post.find().countDocuments(); 
    const posts= await Post.find().skip((currentPage-1)*postsPerPage).limit(postsPerPage);
    res.status(200).json({
        message:'posts founded',
        posts:posts,
        totalItems:totalItems,
        currentPage:currentPage
    })
   } catch (error) {
        res.json(error)
   }
      
}
const updatePost=(req,res)=>{
    const error= new Error()
    const id=req.params.id
    const title=req.body.title
    const content=req.body.content 
    let imageURL=req.body.imageURL
    if(req.file)
    {
        imageURL=req.file.path
    }
    if(!imageURL)
    { 
        error.statusCode=422
        error.message='image not sent'
        throw error
    }
    Post.findById(id)
    .then(post=>{
        if(!post)
        { 
            error.statusCode=404
            error.message='image not sent'
            throw error
            
        }
        if(post.creator.toString()!==req.userId)
        {
            error.statusCode=403
            error.message='not Authorized'
            throw error
        }
        if(imageURL !==post.imageURL)
        {
            removeImage(post.imageURL)
        }
        post.title=title
        post.content=content
        post.imageURL=imageURL
        return post.save()
    })
    .then(result=>{
        res.status(200).json({message:'post Updated',post:result})
    })
    .catch(err=>{
        if(!err.statusCode)
        {
            err.status=500
        }
        return res.json(err)
         
    })
}
const getPost=(req,res)=>{
    const id=req.params.id
    Post.findById(id).then(post=>{
        if(!post){
            const error= new Error('post not found')
            error.statusCode=404
            throw error 
        }
        res.status(200).json({message:'post founded',post:post})
    }).catch(err=>{
        const error= new Error('post not found')
        error.statusCode=500
        throw error
    })
}
const createPost=async (req,res,next)=>{ 
    const errors=validationResult(req)
    if(!errors.isEmpty())
    {
        return res.status(422).json({message:'validation faild, data is incorrect',errors:errors.array()})
    }
    if(!req.file){
        const error= new Error('no image provided')
        error.statusCode=422
        throw error
    }
    let creator;
    const title=req.body.title
    const content=req.body.content
    const imageURL=req.file.path
    const post =new Post({
        title:title,
        content:content,
        creator:req.userId,
        imageURL:imageURL
    }) 
   await post.save()
   .then(result=>{
    return User.findById(req.userId);
   })
   .then(user=>{
    creator=user;
    user.posts.push(post);
    return user.save();
   })
   .then(result=>{
    res.status(201).json({
        message:'post saved successfully',
        post:post,
        creator:{_id:req.userId,creator:creator}
    })
   })
   .catch(err=>
    {
        
        console.log(err)
        const error= new Error('DB Error')
        error.statusCode=500
        throw error
    })
}
const deletePost=(req,res)=>{
    const error= new Error()
    const id=req.params.id
    Post.findById(id)
    .then(post=>{
        if(!post)
        {
            
            error.statusCode=404
            error.message='post not found!'
            throw error
        }
        if(post.creator.toString()!==req.userId)
        {
            error.statusCode=403
            error.message='not Authorized'
            throw error
        }
        removeImage(post.imageURL)
        return Post.findByIdAndDelete(id)

    })
    .then(result=>{
        return User.findById(req.userId)
    })
    .then(user=>{
        user.posts.pull(id)
        return user.save()
    })
    .then(result=>{
        res.status(200).json({message:'one Post deleted'})
    })
    .catch(err=>{
        if(!err.statusCode)
        {
            err.status=500
        }
        return res.json(err)
        
    }) 
}
 
const removeImage=(filePath)=>{
    filePath=path.join(__dirname,'..',filePath)
    fs.unlink(filePath,(err)=>{
        if(err)
        {
            throw new Error ('can not delete image')
        }
    })
}
module.exports={
    getPosts,
    createPost,
    getPost,
    updatePost,
    deletePost
}