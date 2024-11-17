import { Component, OnInit } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { Menu } from 'src/app/core/types/menu.structure';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  selectMenuModalVisible:boolean = false;

  menus:Menu[] = [];
  dineInMenu:Menu|undefined;
  takeawayMenu:Menu|undefined;
  onlineMenu:Menu|undefined;

  constructor(public dataProvider:DataProvider,private databaseService:DatabaseService) {
    firstValueFrom(this.dataProvider.currentBusiness).then((loadedBusiness)=>{
      this.databaseService.getMenus(loadedBusiness.businessId).then((menus)=>{
        this.menus = Object.values(menus);
        console.log("ALL MENUS",this.menus);
        this.dataProvider.selectedMenu = menus[0];
        this.dataProvider.menuLoadedSubject.next(menus[0]);
        if (loadedBusiness){
          this.databaseService.getBusinessSetting(loadedBusiness.businessId).then((businessSettings)=>{
            if (businessSettings?.dineInMenu?.id){
              this.dineInMenu = this.menus.filter((menu:Menu)=>{return menu.id == businessSettings?.dineInMenu?.id})[0];
            }
            if (businessSettings?.onlineMenu?.id){
              this.dineInMenu = this.menus.filter((menu:Menu)=>{return menu.id == businessSettings?.onlineMenu?.id})[0];
            }
            if (businessSettings?.takeawayMenu?.id){
              this.takeawayMenu = this.menus.filter((menu:Menu)=>{return menu.id == businessSettings?.takeawayMenu?.id})[0];
            }
          });
        }
      })
    })
  }

  ngOnInit() {
  }

  selectMenu(menu:Menu){
    this.dataProvider.selectedMenu = menu;
    this.dataProvider.menuLoadedSubject.next(menu);
  }

}
