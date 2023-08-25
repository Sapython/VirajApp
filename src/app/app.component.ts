import { Component } from '@angular/core';
import { DatabaseService } from './core/services/database/database.service';
import { DataProvider } from './core/services/data-provider/data-provider.service';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
declare var navigator:any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private database:DatabaseService,private dataProvider:DataProvider,private platform:Platform,private router:Router) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // if router link is admin.activity then exit
      if(this.router.url === '/admin/activity'){
        if (confirm("Do you want to exit app?")) {
          navigator['app'].exitApp();
        }
      } else {
        // if router link is not admin.activity then go to admin.activity
        if (history.length == 0){
          this.router.navigate(['/admin/activity']);
        } else {
          history.back();
        }
      }
    });
    this.router.events.subscribe(async (event)=>{
      // if the route is anything different than admin/activity and if the currentBusiness id is all then switch the currentBusiness to the first business in the list
      let business = await firstValueFrom(this.dataProvider.currentBusiness);
      if(this.router.url !== '/admin/activity' && business.businessId === 'all'){
        this.dataProvider.currentBusiness.next(this.dataProvider.allBusiness[0]);
      }
    })
  }
}
