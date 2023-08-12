import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { PaymentMethod } from 'src/app/core/types/payment.structure';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {
  paymentMethods:PaymentMethod[] = [];
  constructor(private dataProvider:DataProvider,private databaseService:DatabaseService) {
    this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
      if (loadedBusiness){
        this.databaseService.getPaymentMethods(loadedBusiness.businessId).then((methods)=>{
          console.log("METHODS",methods);
          this.paymentMethods = methods;
        })
      }
    })
  }
  ngOnInit() {
  }

}
