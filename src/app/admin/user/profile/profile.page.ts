import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { UserBusiness } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User|undefined;
  settings:any;
  businessId:string|null = null;
  counters: any[] = [];
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
  constructor(private dataProvider:DataProvider,private authService:AuthService,private alertify:AlertsAndNotificationsService,private router:Router,private databaseService:DatabaseService) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.user = this.dataProvider.currentUser;
      if (business){
        console.log("business",business);
        this.businessId = business.businessId;
        this.databaseService.getCounters(business.businessId).then((counters) => {
          this.counters = counters.docs.map((counter) => {return {id: counter.id, ...counter.data()}});
          console.log("this.counters",this.counters);
        })
      }
    });
    this.dataProvider.currentSettings.subscribe((data)=>{
      this.settings = data;
    });
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

  async updateSettings(data: any) {
    if(this.businessId){
      try {
        await this.databaseService.updateRootSettings(data, this.businessId)
        await this.databaseService.getRootSettings(this.businessId);
        this.alertify.presentToast('Settings updated successfully');
      } catch(e){
        this.alertify.presentToast('Settings updated failed');
      }
    }
  }

  async save(viewTokens:boolean){
    this.dataProvider.loading = true;
    await this.databaseService.updateCounters(this.businessId!,this.counters);
    await this.databaseService.updateHoldTokenView(this.businessId!,viewTokens);
    this.dataProvider.loading = true;
  }

}
