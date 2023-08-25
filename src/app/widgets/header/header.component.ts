import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { UserBusiness } from 'src/app/core/types/user.structure';
import Fuse from 'fuse.js';
import { FormControl } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  @Input() pageTitle:string = '';
  @Input() backRoute:string = '';
  @Input() showOutletSelector:boolean = true;
  @Input() customBackProfileRoute:string = '';
  filteredBusiness:UserBusiness[] = [];
  fuseInstance:Fuse<UserBusiness> = new Fuse([],{keys:['name']});
  allUserBusiness:UserBusiness = {
    access:{
      accessLevel:'admin',
      lastUpdated:Timestamp.fromDate(new Date()),
      updatedBy:''
    },
    address:'',
    businessId:'all',
    joiningDate:Timestamp.fromDate(new Date()),
    name:'All',
  }
  @ViewChild('outletSelector') modal:IonModal|undefined;
  constructor(public dataProvider:DataProvider,private router:Router) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.fuseInstance.setCollection(this.dataProvider.allBusiness);
    });
    // this.router.events.subscribe((event)=>{
    //   // if the route is admin/activity then 
    // })
  }

  ngOnInit() {
  }

  search(event:string){
    let query = event;
    console.log("Event",query);
    if(query.length > 0){
      console.log("Searching",this.fuseInstance);
      
      this.filteredBusiness = this.fuseInstance.search(query).map((result)=>result.item);
    }else{
      this.filteredBusiness = [];
    }
    console.log("Filtered business",this.filteredBusiness);
  }

  reset(){
    this.filteredBusiness = [];
  }
}
