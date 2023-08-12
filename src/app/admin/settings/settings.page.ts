import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
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
  constructor(private authService:AuthService,private alertify:AlertsAndNotificationsService,private router:Router) { }

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
