import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { UserBusiness } from 'src/app/core/types/user.structure';
import Fuse from 'fuse.js';
import { FormControl } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  @Input() pageTitle:string = '';
  @Input() backRoute:string = '';
  @Input() showOutletSelector:boolean = true;
  filteredBusiness:UserBusiness[] = [];
  fuseInstance:Fuse<UserBusiness> = new Fuse([],{keys:['name']});
  @ViewChild('outletSelector') modal:IonModal|undefined;
  constructor(public dataProvider:DataProvider) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.fuseInstance.setCollection(this.dataProvider.allBusiness);
    });
  }

  ngOnInit() {
  }

  search(event:any){
    let query = event.detail.value;
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
