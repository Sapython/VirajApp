import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loyalty',
  templateUrl: './loyalty.page.html',
  styleUrls: ['./loyalty.page.scss'],
})
export class LoyaltyPage implements OnInit {
  loyalties:any[] = [];
  constructor() { }

  ngOnInit() {
  }

}
