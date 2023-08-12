import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { Subject, debounceTime } from 'rxjs';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  delayedLoggedInSubject:Subject<boolean> = new Subject<boolean>();
  constructor(private auth:AuthService,private alertify:AlertsAndNotificationsService,public dataProvider:DataProvider,public loadingCtrl:LoadingController) { 
    this.dataProvider.loggedInSubject.pipe(debounceTime(1000)).subscribe((loggedIn)=>{
      this.delayedLoggedInSubject.next(loggedIn)
    })
  }
  loginForm:FormGroup = new FormGroup({
    username:new FormControl('',[Validators.required,Validators.minLength(4),Validators.pattern('[a-zA-Z0-9]*')]),
    password:new FormControl('',[Validators.required,Validators.minLength(8)])
  })
  ngOnInit() {
  }

  async login(){
    this.loginForm.markAllAsTouched()
    if (this.loginForm.valid){
      let loader = await this.loadingCtrl.create({
        message:'Logging in...'
      });
      loader.present();
      try{
        let result = await this.auth.signInWithUserAndPassword(this.loginForm.value.username,this.loginForm.value.password)
        console.log(result);
        if (result){
          this.alertify.presentToast('Logged in successfully')
        } else {
          this.alertify.presentToast('Invalid username or password')
        }
      } catch (error:any) {
        console.log(error);
        this.alertify.presentToast(error.message);
      }
      loader.dismiss();
    } else {
      this.alertify.presentToast('Please enter a valid username and password')
    }
  }
}
