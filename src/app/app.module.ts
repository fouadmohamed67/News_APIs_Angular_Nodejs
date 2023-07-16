import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { FooterComponent } from './footer/footer.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';

import { AuthguardGuard } from './service/authguard.guard';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    SinglePostComponent,
    FooterComponent,
    SignUpComponent,
    LoginComponent
     
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([  
      {
        path:'',
        component:HomeComponent,
        canActivate:[AuthguardGuard ]
      },
      {
        path:'post/:id',
        component:SinglePostComponent,
        canActivate:[AuthguardGuard]
      },
      {
        path:'login',
        component:LoginComponent
      },
      {
        path:'signUp',
        component:SignUpComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
