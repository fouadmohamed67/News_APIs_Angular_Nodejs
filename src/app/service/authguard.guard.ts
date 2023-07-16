import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {
   


   constructor(private http:HttpClient,private router:Router){
   this.getBoolean();
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
        const res=  this.getBoolean(); 
        return !!res
       
  } 
  getBoolean(){
    const res= this.http.get<any>('http://localhost:3000/auth/ChekToken',{headers:{'Authorization':'Bearer '+localStorage.getItem('token')}})
      .subscribe(res =>{
           if(res.status===401)
           {
              this.router.navigate(['login']) 
              return false
           }  
           return true
        })
   return res; 
  }
}
