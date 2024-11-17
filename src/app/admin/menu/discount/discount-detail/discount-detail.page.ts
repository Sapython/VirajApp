import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { CodeBaseDiscount } from 'src/app/core/types/discount.structure';

@Component({
  selector: 'app-discount-detail',
  templateUrl: './discount-detail.page.html',
  styleUrls: ['./discount-detail.page.scss'],
})
export class DiscountDetailPage implements OnInit {
  currentDiscount:CodeBaseDiscount|undefined;
  editMode:boolean = false;
  discountForm:FormGroup = new FormGroup({
    name:new FormControl('',[Validators.required]),
    value:new FormControl('',[Validators.required]),
    type:new FormControl('',[Validators.required,Validators.pattern('percentage|flat')]),
    minimumAmount: new FormControl('',[Validators.required]),
    minimumProducts: new FormControl('',[Validators.required]),
    maximumDiscount: new FormControl('',[Validators.required]),
    accessLevels: new FormControl('',[Validators.required]),
  });
  constructor(private activatedRoute:ActivatedRoute,private dataProvider:DataProvider,private databaseService:DatabaseService, private loaderController:LoadingController,private alertify:AlertsAndNotificationsService,private router:Router) {
    this.activatedRoute.params.subscribe((params)=>{
      this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
        this.dataProvider.menuLoadedSubject.subscribe((selectedMenu)=>{
          if (loadedBusiness && selectedMenu){
            if (params['discountId']!='new'){
              this.editMode = true;
              this.databaseService.getDiscounts(loadedBusiness.businessId,selectedMenu.id).then((discounts)=>{
                console.log("discounts",discounts);
                this.currentDiscount = discounts.find((discount:CodeBaseDiscount)=>discount.id == params['discountId']);
              })
            } else {
              this.editMode = false;
            }
          }
        })
      })
    });
  }

  ngOnInit() {
  }

  cancel(){
    this.router.navigate(['/admin/menu/discount']);
  }

  async submit(){
    if(this.dataProvider.currentBusiness && this.dataProvider.selectedMenu){
      if (this.editMode){
        let loader = await this.loaderController.create({
          message:'Updating discount...'
        });
        loader.present();
        this.databaseService.updateTax(this.dataProvider.currentBusiness.businessId,this.dataProvider.selectedMenu.id,{...this.currentDiscount,...this.discountForm.value}).then((result)=>{
          this.alertify.presentToast('Discount updated successfully');
          this.router.navigate(['/admin/menu/discount']);
        }).finally(()=>{
          loader.dismiss();
        })
      } else {
        let loader = await this.loaderController.create({
          message:'Adding discount...'
        });
        loader.present();
        this.databaseService.addTax(this.dataProvider.currentBusiness.businessId,this.dataProvider.selectedMenu.id,this.discountForm.value).then((result)=>{
          this.alertify.presentToast('Discount added successfully');
          this.router.navigate(['/admin/menu/discount']);
        }).finally(()=>{
          loader.dismiss();
        });
      }
    }
  }

}
