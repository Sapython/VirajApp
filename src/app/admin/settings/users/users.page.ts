import { Component, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import { BusinessRecord } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
  users:any[] = [];
  addUserModalVisible:boolean = false;
  constructor(private databaseService:DatabaseService,private dataProvider:DataProvider) {
    this.dataProvider.currentBusiness.subscribe((loadedBusiness)=>{
      this.databaseService.getCurrentBusiness(loadedBusiness.businessId).subscribe((business)=>{
        this.users = business['users'];
      });
    })
  }

  ionViewDidEnter(){
  }

  ngOnInit() {
  }

  addUser(){
    
  }
}
