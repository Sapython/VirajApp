import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { CodeBaseDiscount } from 'src/app/core/types/discount.structure';
import { Tax } from 'src/app/core/types/tax.structure';

@Component({
  selector: 'app-tax-detail',
  templateUrl: './tax-detail.page.html',
  styleUrls: ['./tax-detail.page.scss'],
})
export class TaxDetailPage implements OnInit {
  currentTax:Tax|undefined;
  editMode:boolean = false;
  taxForm:FormGroup = new FormGroup({
    name:new FormControl('',[Validators.required]),
    type:new FormControl('',[Validators.required,Validators.pattern('percentage|amount')]),
    mode:new FormControl('',[Validators.required,Validators.pattern('bill|product')]),
    cost:new FormControl('',[Validators.required]),
  });
  constructor(private activatedRoute:ActivatedRoute,private dataProvider:DataProvider,private databaseService:DatabaseService, private loaderController:LoadingController,private alertify:AlertsAndNotificationsService,private router:Router) {
    this.activatedRoute.params.subscribe((params)=>{
      this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
        this.dataProvider.menuLoadedSubject.subscribe((selectedMenu)=>{
          if (loadedBusiness && selectedMenu){
            if (params['taxId']!='new'){
              this.editMode = true;
              this.databaseService.getTaxes(loadedBusiness.businessId,selectedMenu.id).then((taxes)=>{
                console.log("taxes",taxes);
                this.currentTax = taxes.find((discount:CodeBaseDiscount)=>discount.id == params['taxId']);
                if (this.currentTax){
                  this.taxForm.patchValue(this.currentTax);
                }
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
  }

  async submit(){
    // addTax
    if(this.dataProvider.currentBusiness && this.dataProvider.selectedMenu){
      if (this.editMode){
        let loader = await this.loaderController.create({
          message:'Updating tax...'
        });
        loader.present();
        this.databaseService.updateTax(this.dataProvider.currentBusiness.businessId,this.dataProvider.selectedMenu.id,{...this.currentTax,...this.taxForm.value}).then((result)=>{
          this.alertify.presentToast('Tax updated successfully');
          this.router.navigate(['/admin/menu/taxes']);
        }).finally(()=>{
          loader.dismiss();
        })
      } else {
        let loader = await this.loaderController.create({
          message:'Adding tax...'
        });
        loader.present();
        this.databaseService.addTax(this.dataProvider.currentBusiness.businessId,this.dataProvider.selectedMenu.id,this.taxForm.value).then((result)=>{
          this.alertify.presentToast('Tax added successfully');
          this.router.navigate(['/admin/menu/taxes']);
        }).finally(()=>{
          loader.dismiss();
        });
      }
    }
  }
}
