import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import Chart from 'chart.js/auto';
import { debounceTime } from 'rxjs';
import { AnalyticsService } from 'src/app/core/analytics.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { UserBusiness } from 'src/app/core/types/user.structure';
import Swiper, { Navigation, Pagination } from 'swiper';
import SwiperCore, { SwiperOptions, Autoplay } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Autoplay,Pagination,Navigation]);
@Component({
  selector: 'app-sales',
  templateUrl: './sales.page.html',
  styleUrls: ['./sales.page.scss'],
})
export class SalesPage implements OnInit {
  analyticsData:AnalyticsData | undefined;
  salesChartJS: Chart | undefined;
  dateRangeFormGroup: FormGroup = new FormGroup({
    startDate: new FormControl(new Date(), [Validators.required]),
    endDate: new FormControl(new Date(), [Validators.required]),
  });
  @ViewChild('swiperAnalytics', { static: false }) swiperAnalytics?: SwiperComponent;
  @ViewChild('swiperPaymentModes', { static: false }) swiperPaymentModes?: SwiperComponent;
  @ViewChild('billWiseSwiperContainer', { static: false }) billWiseSwiperContainer?: SwiperComponent;
  @ViewChild('swiperItemSales', { static: false }) swiperItemSales?: SwiperComponent;
  @ViewChild('swiperSuspiciousActivity', { static: false }) swiperSuspiciousActivity?: SwiperComponent;
  @ViewChild('userWiseActionSwiper', { static: false }) userWiseActionSwiper?: SwiperComponent;

  constructor(private dataProvider:DataProvider,private analyticsService:AnalyticsService,private loadingCtrl:LoadingController) {
    this.dataProvider.currentBusiness.subscribe(async (business)=>{
      console.log("business",business);
      this.loadData(new Date(),business);
      this.dateRangeFormGroup.valueChanges.pipe(debounceTime(700)).subscribe(async (value)=>{
        this.loadData(value.startDate,business,value.endDate);
      })
    });
  }

  async loadData(startDate:Date,business:UserBusiness,endDate?:Date){
    let loader =await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loader.present();
    this.analyticsService.getAnalytics(startDate,business.businessId,endDate).then((analytics)=>{
      this.analyticsData = analytics;
      console.log("Analytics data",this.analyticsData);
      this.attachData(this.analyticsData);
      loader.dismiss();
      // reload all the sliders
      this.updateAllSlides();
    }).catch((error)=>{
      console.log("Error",error);
      loader.dismiss();
    });
  }
  config: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
  };

  paymentReceivedChannelWise: any = {
    currentChannel: [
      {
        name: 'Cash',
        value: 1000,
      },
      {
        name: 'UPI',
        value: 1400,
      },
      {
        name: 'Online',
        value: 600,
      },
    ],
    max: 10000,
    all: [
      {
        name: 'Cash',
        value: 1000,
      },
      {
        name: 'UPI',
        value: 1400,
      },
      {
        name: 'Online',
        value: 600,
      },
    ],
    dineIn: [
      {
        name: 'Cash',
        value: 1000,
      },
      {
        name: 'UPI',
        value: 1400,
      },
      {
        name: 'Online',
        value: 600,
      },
    ],
    takeaway: [
      {
        name: 'Cash',
        value: 1000,
      },
      {
        name: 'UPI',
        value: 1400,
      },
      {
        name: 'Online',
        value: 600,
      },
    ],
    online: [
      {
        name: 'Cash',
        value: 1000,
      },
      {
        name: 'UPI',
        value: 1400,
      },
      {
        name: 'Online',
        value: 600,
      },
    ],
  };

  itemWiseSales: any = {
    currentChannel: [],
    all: {
      byPrice: [
        {
          name: 'Item 1',
          quantity: 50,
          price: 50000,
        },
        {
          name: 'Item 2',
          quantity: 80,
          price: 1000,
        },
        {
          name: 'Item 3',
          quantity: 60,
          price: 1000,
        },
        {
          name: 'Item 4',
          quantity: 30,
          price: 1000,
        },
      ],
      byQuantity: [
        {
          name: 'Item 3',
          quantity: 60,
          price: 1000,
        },
        {
          name: 'Item 2',
          quantity: 80,
          price: 1000,
        },
        {
          name: 'Item 1',
          quantity: 50,
          price: 50000,
        },
        {
          name: 'Item 4',
          quantity: 30,
          price: 1000,
        },
      ],
    },
  };

  ngOnInit(): void {
    this.salesChartJS = new Chart(document.getElementById('salesData') as HTMLCanvasElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        plugins: {
          legend:{
            display:false
          },
        },
      },
    });

    const swiper = new Swiper('.swiper', {
      // Optional parameters
      direction: 'horizontal',
      loop: true,

      // If we need pagination
      pagination: {
        el: '.swiper-pagination',
      },

      // Navigation arrows
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // And if we need scrollbar
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }

  switchPaymentChannel(channel: string) {
    this.paymentReceivedChannelWise.currentChannel = this.paymentReceivedChannelWise[channel];
  }

  attachData(data:AnalyticsData){
    if (data){
      if(this.salesChartJS){
        console.log("data.salesChannels.all.hourlySales",data.salesChannels.all.hourlySales);
        // update the chart
        let labels = [];
        // generate labels for 24 hour format like 1:00 AM, 2:00 AM, 3:00 AM
        for (let i = 0; i < 24; i++) {
          let hour = i % 12;
          if (hour == 0) hour = 12;
          labels.push(hour + ':00 ' + (i < 12 ? 'AM' : 'PM'));
        }
        var gradient = this.salesChartJS.ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(255, 85, 0,1)');   
        gradient.addColorStop(1, 'rgba(255, 85, 0,0)');
        var secondaryGradient = this.salesChartJS.ctx.createLinearGradient(0, 0, 0, 400);
        secondaryGradient.addColorStop(0, 'rgba(0, 183, 255,1)');   
        secondaryGradient.addColorStop(1, 'rgba(0, 183, 255,0)');
        this.salesChartJS.data = {
          labels: labels,
          datasets: [
            {
              label: 'Sale Per Hour',
              data: [...data.salesChannels.all.hourlySales],
              borderWidth: 1,
              tension: 0.4,
              backgroundColor:gradient,
              fill:true
            },
            {
              label: 'Average Sales',
              data: [...data.salesChannels.all.averageHourlySales],
              borderWidth: 1,
              tension: 0.4,
              backgroundColor:secondaryGradient,
              fill:true
            },
          ],
        };
        this.salesChartJS.update();
      }
    }
  }

  // sliders
  slideNext(index:number|string,swiperRef:SwiperComponent|undefined){
    if(swiperRef){
      console.log("swiperRef",swiperRef,index);
      swiperRef.swiperRef.slideTo(Number(index));
    }
  }

  slideChanged(selector:any,swiperContainer:SwiperComponent|undefined){
    selector.value = (swiperContainer?.swiperRef.activeIndex) || 0;
  }

  updateSlides(billWiseSwiperContainer:any){
    console.log("billWiseSwiperContainer",billWiseSwiperContainer);

  }


  updateAllSlides(){
    this.swiperAnalytics?.swiperRef.update();
    this.swiperPaymentModes?.swiperRef.update();
    this.billWiseSwiperContainer?.swiperRef.update();
    this.swiperItemSales?.swiperRef.update();
    this.swiperSuspiciousActivity?.swiperRef.update();
    this.userWiseActionSwiper?.swiperRef.update();
  }

}

export interface AnalyticsData {
  salesChannels: {
    all: ChannelWiseAnalyticsData;
    dineIn: ChannelWiseAnalyticsData;
    takeaway: ChannelWiseAnalyticsData;
    online: ChannelWiseAnalyticsData;
  };
  customersData: {
    totalCustomers: number;
    totalCustomersByChannel: {
      dineIn: number;
      takeaway: number;
      online: number;
    };
    totalNewCustomers: number;
    totalNewCustomersByChannel: {
      dineIn: number;
      takeaway: number;
      online: number;
    };
    newCustomers: {
      name: string;
      phone: string;
      joiningDate: Timestamp;
      email?: string;
      address?: string;
      loyaltyPoint: number;
    }[];
    allCustomers: {
      name: string;
      phone: string;
      joiningDate: Timestamp;
      email?: string;
      address?: string;
      loyaltyPoint: number;
    }[];
  };
  createdAt: Timestamp;
  createdAtUTC: string;
}

export interface ChannelWiseAnalyticsData {
  totalSales: number;
  netSales: number;
  totalDiscount: number;
  totalNC: number;
  totalTaxes: number;
  hourlySales: number[];
  averageHourlySales: number[];
  totalSettledBills: number;
  totalUnsettledBills: number;
  totalDiscountedBills: number;
  totalNcBills: number;
  paymentReceived: {
    [key: string]: number;
  };
  billWiseSales: {
    rangeWise:{
      lowRange: {
        bills: {
          billId: string;
          billRef: any;
          totalSales: number;
          time: Timestamp;
        }[];
        totalSales: number;
      };
      mediumRange: {
        bills: {
          billId: string;
          billRef: any;
          totalSales: number;
          time: Timestamp;
        }[];
        totalSales: number;
      };
      highRange: {
        bills: {
          billId: string;
          billRef: any;
          totalSales: number;
          time: Timestamp;
        }[];
        totalSales: number;
      }
    },
    tableWise:{
      table:string;
      tableId:string;
      totalSales:number;
      totalBills:number;
      bills:{
        billId: string,
        billRef: any,
        time: any,
        totalSales: number,
      }[]
    }[],
    maxTables:number;
    time:{
      time:string;
      timeNumber:number;
      totalSales:number;
      totalBills:number;
      bills:{
        billId: string,
        billRef: any,
        time: any,
        totalSales: number,
      }[]
    }[]
  };
  itemWiseSales: {
    byPrice: {
      name: string;
      id: string;
      price: number;
      quantity: number;
      category: {
        name: string;
        id: string;
      };
    }[];
    byQuantity: {
      name: string;
      id: string;
      price: number;
      quantity: number;
      category: {
        name: string;
        id: string;
      };
    }[];
    priceTopCategory:any;
    quantityTopCategory:any;
    byPriceMax:number;
    byQuantityMax:number;
  };
  suspiciousActivities: any[];
  userWiseActions: [
    {
      userId: string;
      userRef: any;
      actions: {
        bills:any[];
        kots:any[];
        discounts: any[];
        settlements: any[];
        ncs: any[];
      };
    },
  ];
}
