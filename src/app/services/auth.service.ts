import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { interval, lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http:HttpClient,private router:Router) { }
  
  async isLogin(){
   const res=await this.getBoolean()
   let toStr=JSON.stringify(res)
   const toJs =JSON.parse(toStr)
   if(toJs.status===401)
   {
    console.log("res false")
    return false
   }
   console.log("res tre")
   return true
   
  }
 async getBoolean(){
    const req= this.http.get('http://localhost:3000/auth/ChekToken',{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
      .pipe(take(1))
      const res= await lastValueFrom(req);
      return res;
  } 
  logout():any{
    localStorage.removeItem('token')
   
  }
}
