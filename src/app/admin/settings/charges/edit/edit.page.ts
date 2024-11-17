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
  currentMethodId:string|undefined;
  paymentMethodForm:FormGroup = new FormGroup({
    name:new FormControl(''),
    detail:new FormControl('')
  });
  public charges:{
    dineIn:Charge,
    takeaway:Charge,
    online:Charge
  }|undefined;
  constructor(private activatedRoute:ActivatedRoute,private dataProvider:DataProvider,private databaseService:DatabaseService,private router:Router,private loadingCtrl:LoadingController,private alertify:AlertsAndNotificationsService) {
    this.activatedRoute.params.subscribe((params)=>{
      this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
        if (loadedBusiness){
          this.currentMethodId = params['methodId'];
          this.databaseService.getBusinessSetting(loadedBusiness.businessId).then((settings)=>{
            if (settings){
              this.charges = settings['charges'] || {
                dineIn:{
                  container:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  delivery:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  service:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  tip:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                },
                takeaway:{
                  container:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  delivery:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  service:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  tip:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                },
                online:{
                  container:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  delivery:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  service:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                  tip:{
                    allowed:false,
                    byDefault:false,
                    fixed:false,
                    charges:0
                  },
                },
              };
            }
          })
        }
      })
    });
  }

  async saveCharges(){
    let business = await firstValueFrom(this.dataProvider.currentBusiness);
    let loading = await this.loadingCtrl.create();
    loading.present();
    if (business){
      this.databaseService.updateBusinessSetting(business.businessId,{charges:this.charges}).then(()=>{
        this.alertify.presentToast('Charges updated successfully');
        this.router.navigate(['admin','settings','charges']);
      }).catch((error)=>{
        this.alertify.presentToast('Error updating charges');
      }).finally(()=>{
        loading.dismiss();
      })
    }
  }

  ngOnInit() {
  }

  

  cancel(){

  }


}

export interface Charge {
  delivery: {
    allowed: boolean;
    byDefault: boolean;
    fixed: boolean;
    charges?: number;
  };
  tip: {
    allowed: boolean;
    byDefault: boolean;
    fixed: boolean;
    charges?: number;
  };
  container: {
    allowed: boolean;
    byDefault: boolean;
    fixed: boolean;
    charges?: number;
  };
  service: {
    allowed: boolean;
    byDefault: boolean;
    fixed: boolean;
    charges?: number;
  };
}
