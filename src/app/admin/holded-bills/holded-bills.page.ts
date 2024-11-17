import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';

@Component({
  selector: 'app-holded-bills',
  templateUrl: './holded-bills.page.html',
  styleUrls: ['./holded-bills.page.scss'],
})
export class HoldedBillsPage implements OnInit {
  counters: any[] = [];
  constructor(
    private dataProvider: DataProvider,
    private databaseService: DatabaseService
  ) {
    this.dataProvider.currentBusiness.subscribe(async (data) => {
      this.databaseService.getCounters(data.businessId).then((counters) => {
        this.counters = counters.docs.map((counter) => {return {id: counter.id, ...counter.data()}});
      })
    });
  }

  ngOnInit() {
    
  }
}
