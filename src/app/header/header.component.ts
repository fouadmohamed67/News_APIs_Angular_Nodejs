import { Component } from '@angular/core'; 
import { AuthService } from '../services/auth.service'; 
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {  
  user:any
  isLogin:any
  
    constructor(private authserive:AuthService,private router:Router){
      
    }   
      ngOnInit(){ 
      this.user=localStorage.getItem('token') 
      
    }
    logout(){
      this.authserive.logout() 
      this.router.navigate(['login'])
      
    }
   
      
     


    
  
}
