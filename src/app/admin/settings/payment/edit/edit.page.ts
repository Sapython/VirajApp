import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  constructor(private activatedRoute:ActivatedRoute,private dataProvider:DataProvider,private databaseService:DatabaseService) {
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

  cancel(){

  }

  save(){
    
  }

}
