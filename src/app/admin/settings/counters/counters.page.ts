import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';

@Component({
  selector: 'app-counters',
  templateUrl: './counters.page.html',
  styleUrls: ['./counters.page.scss'],
})
export class CountersPage implements OnInit {
  counters:any[] = [];
  businessId:string|null = null;
  constructor(private dataProvider:DataProvider,private databaseService:DatabaseService) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      if (business){
        console.log("business",business);
        this.businessId = business.businessId;
        this.databaseService.getCounters(business.businessId).then((counters) => {
          this.counters = counters.docs.map((counter) => {return {id: counter.id, ...counter.data()}});
          console.log("this.counters",this.counters);
        })
      }
    });
  }

  async ionViewDidEnter(){
    let loadedBusiness = await firstValueFrom(this.dataProvider.currentBusiness);
    this.databaseService.getCounters(loadedBusiness.businessId).then((counters) => {
      this.counters = counters.docs.map((counter) => {return {id: counter.id, ...counter.data()}});
      console.log("this.counters",this.counters);
    })
  }

  ngOnInit() {
  }

}
