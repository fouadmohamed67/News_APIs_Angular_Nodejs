import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';  
import { AuthService } from '../services/auth.service';
interface postsArray{
 posts:any[]
} 
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 
  
  totalItems:any
  currentPage=1

  submited!:boolean
  form:FormGroup
  hidden=true
  Posts:any
  file:any  
  alertMessage:string|undefined
  typeOfAction:string|undefined

  constructor(private router:Router,private http:HttpClient,private authService:AuthService){
    
    this.form = new FormGroup({
      title: new FormControl('',[Validators.required,Validators.minLength(5)]),
      content: new FormControl('',[Validators.required,Validators.minLength(5)]), 
    });
    
  }
 async ngOnInit(){
      
      this.getAllPosts(this.currentPage)
  }
  onFileChange($event:any){ 
    this.file=$event.target.files[0]  
  }
  getAllPosts(page:number){ 
    this.http.get<any>('http://localhost:3000/feed/posts',{params:new HttpParams().set('page',page),headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
    .subscribe((data)=>{   
      this.Posts=data.posts  
      this.totalItems= Math.ceil(data.totalItems/2)
      this.totalItems=Array(this.totalItems).fill(1).map((x,i)=>i+1) 
      }) 
  }
   
  createPost(form:FormGroup){   
    this.submited=true
    if(this.form.valid && this.file)
    {  
      let testData = new FormData();
      testData.append('content', form.value.content );
      testData.append('title',form.value.title );
      testData.append('image', this.file); 
      this.http.post<any>('http://localhost:3000/feed/post',testData,{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}}).subscribe(res=>{
         console.log(res);
        this.typeOfAction='green'
        this.alertMessage=res.message
        this.getAllPosts(1)
        setTimeout(()=>{
          this.alertMessage=undefined
        },3000) 
      })
      form.reset();
      this.submited=false
      this.hidden=true
      
     
      return true
    } 
    return false
   }

   toggleClass() { 
    this.hidden=!this.hidden
   }
   get getFormControl() {
    return this.form.controls;
  }
}
