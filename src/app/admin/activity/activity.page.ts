import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  switchTab(event:any){
    console.log(event);
  }
}
