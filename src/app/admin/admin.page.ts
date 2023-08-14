import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
declare var navigator:any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(private platform:Platform,private router:Router) {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // if router link is admin.activity then exit
      if(this.router.url === '/admin/activity'){
        if (confirm("Do you want to exit app?")) {
          navigator['app'].exitApp();
        }
      } else {
        // if router link is not admin.activity then go to admin.activity
        this.router.navigate(['/admin/activity']);
      }
    });
  }

  ngOnInit() {
  
  }

}
