import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { CodeBaseDiscount } from 'src/app/core/types/discount.structure';
import { PaymentMethod } from 'src/app/core/types/payment.structure';
import { Tax } from 'src/app/core/types/tax.structure';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  currentPaymentMethod:PaymentMethod|undefined;
  editMode:boolean = false;
  paymentMethodForm:FormGroup = new FormGroup({
    name:new FormControl(''),
    detail:new FormControl('')
  });
  constructor(private activatedRoute:ActivatedRoute,private dataProvider:DataProvider,private databaseService:DatabaseService,private router:Router,private loadingCtrl:LoadingController,private alertify:AlertsAndNotificationsService) {
    this.activatedRoute.params.subscribe((params)=>{
      this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
        if (loadedBusiness){
          if (params['methodId']!='new'){
            this.editMode = true;
            this.databaseService.getPaymentMethods(loadedBusiness.businessId).then((methods)=>{
              console.log("taxes",methods);
              this.currentPaymentMethod = methods.find((method:any)=>method.id == params['methodId']);
              if(this.currentPaymentMethod){
                this.paymentMethodForm.patchValue(this.currentPaymentMethod);
              }
            })
          } else {
            this.editMode = false;
          }
        }
      })
    });
  }

  ngOnInit() {
  }

  async deleteMethod(){
    if (this.currentPaymentMethod?.id){
      if(confirm("Are you sure you want to delete this ?")){
        let business = await firstValueFrom(this.dataProvider.currentBusiness);
        this.databaseService.deletePaymentMethod(business.businessId,this.currentPaymentMethod.id);
        this.router.navigate(['admin/settings/payment']);
      }
    }
  }

  cancel(){

  }

  async save(){
    let loader = await this.loadingCtrl.create({
      message:"Saving..."
    });
    loader.present();
    let business = await firstValueFrom(this.dataProvider.currentBusiness);
    if (this.paymentMethodForm.valid){
      this.databaseService.addPaymentMethod(business.businessId,this.paymentMethodForm.value).then(()=>{
        this.alertify.presentToast("Payment method saved");
        this.router.navigate(['admin/settings/payment']);
      })
      .catch((error)=>{
        console.log("Error",error);
        this.alertify.presentToast("Failed saving payment method");
      })
      .finally(()=>{
        loader.dismiss();
      });
    }
  }

}
