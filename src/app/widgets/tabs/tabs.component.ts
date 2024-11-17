import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent  implements OnInit {
  @Input() tabs:string[] = [];
  @Output() tabSwitched:EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedTab:number = 0;
  public currentTab:string = '';
  constructor() { }

  ngOnInit() {
    this.currentTab = this.tabs[this.selectedTab];
  }

}
