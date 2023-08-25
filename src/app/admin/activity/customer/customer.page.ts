import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { CustomerInfo } from 'src/app/core/types/user.structure';
import Fuse from 'fuse.js';
import { Subject, debounce, debounceTime, firstValueFrom } from 'rxjs';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-customer',
  templateUrl: './customer.page.html',
  styleUrls: ['./customer.page.scss'],
})
export class CustomerPage implements OnInit {
  customers:CustomerInfo[] = [];
  filteredCustomers:CustomerInfo[] = [];
  recentlyAddedCustomers:CustomerInfo[] = [];
  filteredRecentlyAddedCustomers:CustomerInfo[] = [];
  searchSubject:Subject<string> = new Subject<string>();
  lastCheckedAt:Date = new Date();
  stats = {
    totalCustomers:0,
    averageBills:0,
    newCustomers:0,
    existingCustomers:0,
  };
  private calculateLoyaltyPointForBusiness = httpsCallable(
    this.functions,
    'calculateLoyaltyPointForBusiness'
  );
  constructor(private dataProvider:DataProvider, private databaseService:DatabaseService,private functions:Functions, private loadingCtrl:LoadingController) {
    this.dataProvider.currentBusiness.subscribe((data)=>{
      this.databaseService.getCustomers(data.businessId).then((customers)=>{
        console.log("customers",customers);
        this.customers = customers;
        this.recentlyAddedCustomers = customers.filter((customer)=>{
          // filter today's customer
          return customer.created?.toDate().toDateString() == new Date().toDateString();
        });
        this.stats.totalCustomers = customers.length;
        this.stats.averageBills = this.roundOff(customers.reduce((acc, customer)=>{
          return acc + (customer.totalSales || 0);
        }
        ,0)/customers.length);
        this.stats.newCustomers = this.recentlyAddedCustomers.length;
        this.stats.existingCustomers = this.stats.totalCustomers - this.stats.newCustomers;
      });
    });
    this.searchSubject.pipe(debounceTime(600)).subscribe((query)=>{
      if(query){
        const fuse = new Fuse(this.customers, {
          keys: [
            'name',
            'phone',
            'address',
          ],
        });
        this.filteredCustomers = fuse.search(query).map((result)=>{
          return result.item;
        });
        this.filteredRecentlyAddedCustomers = fuse.search(query).map((result)=>{
          return result.item;
        });
      } else {
        this.filteredCustomers = [];
        this.filteredRecentlyAddedCustomers = [];
      }
    })
  }

  async refresh(){
    let currentBusiness = await firstValueFrom(this.dataProvider.currentBusiness);
    let loader = await this.loadingCtrl.create({
      message:"Refreshing...",
    });
    await loader.present();
    this.calculateLoyaltyPointForBusiness({businessId:currentBusiness.businessId})
    .then(()=>{
      console.log("Loyalty points calculated");
    })
    .finally(async ()=>{
      await loader.dismiss();
    });
  }

  ngOnInit() {
  }

  roundOff(value:number){
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

}
