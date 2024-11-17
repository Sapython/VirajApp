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
  editMode:boolean = false;
  settings:any;
  constructor(private databaseService:DatabaseService,private dataProvider:DataProvider, private alertify:AlertsAndNotificationsService) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      if (business){
        this.businessId = business.businessId;
      }
    });
    this.dataProvider.currentSettings.subscribe((data)=>{
      this.settings = data;
      if (!this.settings.tokensResetSetting){
        this.settings.tokensResetSetting = {
          billNo: false,
          takeawayTokenNo: false,
          onlineTokenNo: false,
          orderNo: false,
          ncBillNo: false,
          kotNo: false
        };
      }
      
      if (!this.settings.printSettings){
        this.settings.printSettings = {
          showBillTime: true,
          showBillDate: true,
          showBillNo: true,
          showOrderId: true,
          showCashier: true,
          showMode: true,
        };
      }

    })
  }

  ngOnInit() {
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
