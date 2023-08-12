import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { Combo } from 'src/app/core/types/combo.structure';

@Component({
  selector: 'app-combos',
  templateUrl: './combos.page.html',
  styleUrls: ['./combos.page.scss'],
})
export class CombosPage implements OnInit {
  combos:Combo[] = []
  constructor(private activatedRoute:ActivatedRoute,private databaseService:DatabaseService,private dataProvider:DataProvider){
    this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
      this.dataProvider.menuLoadedSubject.subscribe((selectedMenu)=>{
        this.activatedRoute.params.subscribe(params => {
          console.log("params updated",params,loadedBusiness);
          if (params && this.dataProvider.currentBusiness && this.dataProvider.selectedMenu){
            this.databaseService.getCombos(this.dataProvider.currentBusiness?.businessId,this.dataProvider.selectedMenu.id).then((combos)=>{
              console.log("combos",combos);
              this.combos = combos;
            })
          }
        });
      });
    })
  }

  ngOnInit() {
  }

}
