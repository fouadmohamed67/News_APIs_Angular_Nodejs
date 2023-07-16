import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { lastValueFrom, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'posts';
  show:boolean|undefined;
  constructor(public router:Router){ 
  
  } 

 
 
  
}
