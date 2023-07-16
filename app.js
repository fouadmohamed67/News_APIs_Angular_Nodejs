const express=require('express')
const bodyParser=require('body-parser')
const mongooes=require('mongoose');
const app=express()
const path=require('path')
const multer=require('multer')

const fileStorage=multer.diskStorage({
    destination:(req,file,cb)=>{
       
        cb(null,'images')
    },filename:(req,file,cb)=>{  
        cb(null,new Date().toISOString().replace(/:/g, '-')+'_'+file.originalname)
    }
})
const fileFilter=(req,file,cb)=>{
    if(
        file.mimetype === 'image/png'||
        file.mimetype === 'image/jpg'||
        file.mimetype === 'image/jpeg'
     ){ 
        cb(null,true)
      }
      else{ 
        cb(null,false)
      }
}
const feedRoute=require('./routes/feed')
const authRoute=require('./routes/auth')

app.use(bodyParser.json())
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single('image'))
app.use('/images', express.static(path.join(__dirname,'images')))



app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200')
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Credentials', true);
    next()
}) 

app.use('/feed',feedRoute)
app.use('/auth',authRoute)

mongooes.connect('mongodb+srv://fouad:07906028@cluster0.zvwvnib.mongodb.net/posts?retryWrites=true&w=majority')
.then(result=>{
     app.listen(3000) 
})
.catch(err=>{
    console.log(err)
})
 