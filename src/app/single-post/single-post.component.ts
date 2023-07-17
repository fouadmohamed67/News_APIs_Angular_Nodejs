import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent {
  post:any
  typeOfAction:string|undefined
  alertMessage:string|undefined
  hidden=true
  form:FormGroup
  file:any
  postId!:string
  submited!:boolean 

  constructor(private route:ActivatedRoute,private http:HttpClient,private router:Router){
    this.form = new FormGroup({
      title: new FormControl('',[Validators.required,Validators.minLength(5)]),
      content: new FormControl('',[Validators.required,Validators.minLength(5)]), 
    });  
  }

  ngOnInit(){  
    this.route.params.subscribe(param=>{
      this.postId=param['id']
      const id=param['id']
      this.getPost(id)  
    }) 
  }

  getPost(id:string){
    this.http.get<any>('http://localhost:3000/feed/post/'+id,{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
    .subscribe((post )=>{ 
      this.post=post
      this.form.get('content')?.setValue(post.post.content)
      this.form.get('title')?.setValue(post.post.title)
    }) 
  }

  toggleClass() { 
    this.hidden=!this.hidden
   } 

  onFileChange($event:any){ 
    this.file=$event.target.files[0] 
  }

  updatePost(form:FormGroup){
    this.submited=true    
    if(this.form.valid)
    {  
      let testData = new FormData();
      testData.append('content', form.value.content );
      testData.append('title',form.value.title );
      if(this.file){testData.append('image', this.file);} 
      else {testData.append('imageURL',this.post.post.imageURL)}
      this.http.put('http://localhost:3000/feed/post/'+this.postId,testData,{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
      .subscribe((data:any)=>{
       if(data.statusCode===403)
       {
        this.typeOfAction='red'
       }
       else
       {
        this.typeOfAction='green'
       }
        this.getPost(this.postId) 
        this.alertMessage=data.message 
      })
    }
    this.submited=false
    this.toggleClass() 
    setTimeout(()=>{
      this.alertMessage=undefined
    },3000)  
  }

  deletePost(){
    this.http.delete('http://localhost:3000/feed/post/'+this.postId,{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
    .subscribe((result:any)=>{
      this.typeOfAction='red'
      this.alertMessage=result.message
      if(result.statusCode!==403)
      {
        setTimeout(() => {
          this.router.navigate([''])
        }, 1500);
      }
      else
      {
        setTimeout(()=>{
          this.alertMessage=undefined
        },3000)  
      }
    })
  }

  get getFormControl() {
    return this.form.controls;
  }
}
