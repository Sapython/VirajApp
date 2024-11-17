import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { CodeBaseDiscount } from 'src/app/core/types/discount.structure';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.page.html',
  styleUrls: ['./discount.page.scss'],
})
export class DiscountPage implements OnInit {
  discounts:CodeBaseDiscount[] = [];
  constructor(private dataProvider:DataProvider,private databaseService:DatabaseService) {
    this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
      this.dataProvider.menuLoadedSubject.subscribe((selectedMenu)=>{
        if (loadedBusiness && selectedMenu){
          this.databaseService.getDiscounts(loadedBusiness.businessId,selectedMenu.id).then((discounts)=>{
            this.discounts = discounts;
          })
        }
      })
    })
  }

  ngOnInit() {
  }

  addDiscount(){
    
  }

}
