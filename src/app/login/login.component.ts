import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  submited!:boolean
  form:FormGroup 
  validResponse=true
  errorMessage!:string

  constructor(private router:Router,private http:HttpClient){
    this.form = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.minLength(5),Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(6)])
    }); 
  }
    
  login(form:FormGroup){
    this.submited=true; 
    if(this.form.valid)
    {
      let testData=new FormData(); 
      testData.append('email',form.value.email);
      testData.append('password',form.value.password);
      this.http.post<any>('http://localhost:3000/auth/login',testData)
      .subscribe(res=>{  
        if(res.message)
        {  
             this.errorMessage=res.message
             this.validResponse=false 
        }
        else
        { 
          localStorage.setItem('token',res.token) 
             this.router.navigate(['']);  
        }
      })
    }
  
  }
  get getFormControl() {
    return this.form.controls;
  }
}
