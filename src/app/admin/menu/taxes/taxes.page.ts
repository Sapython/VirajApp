import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { CodeBaseDiscount } from 'src/app/core/types/discount.structure';
import { Tax } from 'src/app/core/types/tax.structure';

@Component({
  selector: 'app-taxes',
  templateUrl: './taxes.page.html',
  styleUrls: ['./taxes.page.scss'],
})
export class TaxesPage implements OnInit {
  taxes:Tax[] = [];
  constructor(private dataProvider:DataProvider,private databaseService:DatabaseService) {
    this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
      this.dataProvider.menuLoadedSubject.subscribe((selectedMenu)=>{
        if (loadedBusiness && selectedMenu){
          this.databaseService.getTaxes(loadedBusiness.businessId,selectedMenu.id).then((taxes)=>{
            this.taxes = taxes;
          })
        }
      })
    })
  }

  ngOnInit() {
  }

}
