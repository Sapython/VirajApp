import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { UserBusiness } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-business',
  templateUrl: './business.page.html',
  styleUrls: ['./business.page.scss'],
})
export class BusinessPage implements OnInit {
  currentBusiness:UserBusiness|undefined;
  editMode:boolean = false;
  settingsForm: FormGroup = new FormGroup({
    hotelName: new FormControl('', [
      Validators.required,
    ]),
    phone: new FormControl('', [
      Validators.required,
    ]),
    address: new FormControl('', [
      Validators.required,
    ]),
    gst: new FormControl('', [
      Validators.required,
    ]),
    fssai: new FormControl('', [
      Validators.required,
    ]),
  });
  constructor(private databaseService:DatabaseService,private dataProvider:DataProvider,private loaderController:LoadingController,private alertify:AlertsAndNotificationsService,private router:Router) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.currentBusiness = business;
      console.log("menu",business);
      this.databaseService.getCurrentSettings(business.businessId).then((settings)=>{
        console.log("settings",settings);
        if(settings){
          this.settingsForm.patchValue(settings);
        }
      })
    });
  }

  ngOnInit() {
  }

  async submit(){
    if(this.currentBusiness){
      let loader = await this.loaderController.create({
        message:'Updating settings...'
      });
      loader.present();
      this.databaseService.updateCurrentSettings(this.settingsForm.value,this.currentBusiness.businessId).then(()=>{
        this.alertify.presentToast('Settings updated successfully');
        this.router.navigate(['/admin/settings']);
      }).catch((error)=>{
        this.alertify.presentToast('Error while updating settings');
      }).finally(()=>{
        loader.dismiss();
      })
    }
  }

}
