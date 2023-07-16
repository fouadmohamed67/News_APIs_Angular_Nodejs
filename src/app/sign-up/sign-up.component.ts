import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  submited!:boolean
  form:FormGroup
  validResponse=true

  constructor(private router:Router,private http:HttpClient){
    this.form = new FormGroup({
      email: new FormControl('',[Validators.required,Validators.minLength(5),Validators.email]),
      password: new FormControl('',[Validators.required,Validators.minLength(6)]), 
      name:new FormControl('',[Validators.required,Validators.minLength(3)])
    }); 
    
  }
    
  createUser(form:FormGroup){ 
    this.submited=true;
    if(this.form.valid)
    {
      let testData=new FormData();
      testData.append('name',form.value.name);
      testData.append('email',form.value.email);
      testData.append('password',form.value.password);
      this.http.put<any>('http://localhost:3000/auth/signUp',testData)
      .subscribe(res=>{
        if(res.errors)
        { 
            this.validResponse=false
            
        }
        else
        {
          this.router.navigate(['login'])
        }
      })
    }
    
  }
  get getFormControl() {
    return this.form.controls;
  }
}
