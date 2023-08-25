import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { UserBusiness } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User|undefined;
  public logOutActionsSheetButtons = [
    {
      text: 'Logout',
      role: 'destructive',
      data: {
        action: 'logout',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
  constructor(private dataProvider:DataProvider,private authService:AuthService,private alertify:AlertsAndNotificationsService,private router:Router) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.user = this.dataProvider.currentUser;
    })
  }

  ngOnInit() {
  }

  logout(event:any){
    console.log("Logout",event);
    if (event.detail.data.action === 'logout'){
      this.authService.logOut();
      this.alertify.presentToast("Logged out successfully");
      this.router.navigate(['/login']);
    } else {
      this.alertify.presentToast("Cancelled logout")
    }
  }


}
