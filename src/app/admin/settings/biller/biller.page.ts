import { Component, OnInit } from '@angular/core';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';

@Component({
  selector: 'app-biller',
  templateUrl: './biller.page.html',
  styleUrls: ['./biller.page.scss'],
})
export class BillerPage implements OnInit {
  businessId:string|null = null;
  constructor(private databaseService:DatabaseService,private dataProvider:DataProvider, private alertify:AlertsAndNotificationsService) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      if (business){
        this.businessId = business.businessId;
      }
    })
  }

  ngOnInit() {
  }


  updateSettings(data: any) {
    if(this.businessId){
      this.databaseService
        .updateRootSettings(data, this.businessId)
        .then(() => {
          this.alertify.presentToast('Settings updated successfully');
        })
        .catch((err) => {
          this.alertify.presentToast('Error while updating settings');
        });
    }
  }

  isValidNumber(number:any){
    console.log("number",number,!Number(number) || typeof(number) !== "number" || number < 0);
    if (!Number(number) || typeof(number) !== "number" || number < 0){
      alert("Please enter a valid number");
      return false;
    } else {
      return true;
    }
  }

}
