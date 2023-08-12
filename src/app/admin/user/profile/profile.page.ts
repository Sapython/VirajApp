import { Component, Input, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { UserBusiness } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: User|undefined;
  
  constructor(private dataProvider:DataProvider) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.user = this.dataProvider.currentUser;
    })
  }

  ngOnInit() {
  }

}
