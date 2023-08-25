import { AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { SwiperComponent } from 'swiper/angular';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit, AfterViewInit {
  @ViewChild('pageSwiper') pageSwiper: SwiperComponent|undefined;
  constructor(private router:Router,private dataProvider:DataProvider) { }

  ngOnInit() {
  }
 
  switchTab(event:any,matTabGroup:any){
    let index= 0;
    if (event == 'sales'){
      index = 0;
      this.dataProvider.routeChanged.next('sales');
    } else if (event == 'tables'){
      index = 1;
      this.dataProvider.routeChanged.next('other');
    } else if (event == 'customer'){
      index = 2;
      this.dataProvider.routeChanged.next('other');
    }
    console.log(index,event);
    matTabGroup.selectedIndex = index;
    // pageSwiper.swiperRef.slideTo(index)
  }

  refetchTab(switcher:any){
    this.dataProvider.routeChanged.next('sales');
    if(switcher.selectedIndex == 0){
      this.dataProvider.routeChanged.next('sales');
    } else {
      this.dataProvider.routeChanged.next('other');
    }
  }

  ngAfterViewInit(): void {
    this.pageSwiper?.swiperRef.loopDestroy();
  }
}
