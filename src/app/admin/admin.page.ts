import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { fadeInOnEnterAnimation, fadeOutDownOnLeaveAnimation } from 'angular-animations';
import { DataProvider } from '../core/services/data-provider/data-provider.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  animations:[
    fadeOutDownOnLeaveAnimation({duration:100}),
    fadeInOnEnterAnimation({duration:100})
  ],
})
export class AdminPage implements OnInit {
  tabs:{
    link:string,
    icon:string,
    title:string
  }[] = [
    {
      link:'admin/activity',
      icon:'ri-dashboard-fill',
      title:'Activity'
    },
    {
      link:'admin/reports',
      icon:'ri-file-excel-2-fill',
      title:'Reports'
    },
    {
      link:'admin/settings',
      icon:'ri-settings-4-fill',
      title:'Settings'
    },
  ];

  paddingOffset:number = 40;

  currentTabIndex:number= 0;

  constructor(private navCtrl:NavController,private router:Router,private dataProvider:DataProvider) {
    
  }

  ngOnInit() {
  
  }

  switchTabByIndex(index:number){
    if(index == this.currentTabIndex){
      return;
    }
    if (index == 0){
      this.dataProvider.routeChanged.next('sales');
    } else {
      this.dataProvider.routeChanged.next('other');
    }
    console.log("index",index,"this.currentTabIndex",this.currentTabIndex);
    if (index < this.currentTabIndex){
      this.navCtrl.navigateBack(this.tabs[index].link)
    } else {
      this.navCtrl.navigateForward(this.tabs[index].link)
    }
    this.currentTabIndex = index;
  }

}
