import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-tabs',
  templateUrl: './bottom-tabs.component.html',
  styleUrls: ['./bottom-tabs.component.scss'],
  encapsulation:ViewEncapsulation.None
})
export class BottomTabsComponent  implements OnInit {
  @Input() tabs:{
    link:string,
    icon:string,
    title:string
  }[] = [];
  @Input() paddingOffset:number = 40;

  currentTabIndex:number= 0;

  @Output() tabChanged:EventEmitter<{name:string,index:number,link:string}> = new EventEmitter<{name:string,index:number,link:string}>();
  constructor(private router:Router) { }

  ngOnInit() {}

  switchTabByIndex(index:number){
    this.currentTabIndex = index;
    console.log("this.tabs[index].link",this.tabs[index].link);
    this.tabChanged.emit({name:this.tabs[index].title,index:index,link:this.tabs[index].link});
    console.log("switchTabByIndex",index);
  }

}
