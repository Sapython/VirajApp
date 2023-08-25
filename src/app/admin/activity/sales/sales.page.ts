import { Component, OnInit, ViewChild } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import Chart from 'chart.js/auto';
import { Subject, Subscription, debounceTime, firstValueFrom } from 'rxjs';
import { AnalyticsService } from 'src/app/core/analytics.service';
import { ActivityDetailService } from 'src/app/core/services/activityDetail/activity-detail.service';
import { AlertsAndNotificationsService } from 'src/app/core/services/alerts-and-notification/alerts-and-notifications.service';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
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
  multipleOutletAnalyticsData:AnalyticsData[] = [];
  multipleOutletAnalyticsDataModified:Subject<void> = new Subject<void>();
  allOutletAnalyticsData:AnalyticsData|undefined;
  salesChartJS: Chart | undefined;
  dateRangeFormGroup: FormGroup = new FormGroup({
    startDate: new FormControl(new Date(), [Validators.required]),
    endDate: new FormControl(new Date(), [Validators.required]),
  });
  analyticsSubscription:Subscription = Subscription.EMPTY;
  refreshing:boolean = false;
  @ViewChild('swiperAnalytics', { static: false }) swiperAnalytics?: SwiperComponent;
  @ViewChild('swiperPaymentModes', { static: false }) swiperPaymentModes?: SwiperComponent;
  @ViewChild('billWiseSwiperContainer', { static: false }) billWiseSwiperContainer?: SwiperComponent;
  @ViewChild('swiperItemSales', { static: false }) swiperItemSales?: SwiperComponent;
  @ViewChild('swiperSuspiciousActivity', { static: false }) swiperSuspiciousActivity?: SwiperComponent;
  @ViewChild('userWiseActionSwiper', { static: false }) userWiseActionSwiper?: SwiperComponent;
  private analyzeAnalyticsForBusiness = httpsCallable(
    this.functions,
    'analyzeAnalyticsForBusiness'
  );
  constructor(public dataProvider:DataProvider,private analyticsService:AnalyticsService,private loadingCtrl:LoadingController,private functions:Functions,private alertify:AlertsAndNotificationsService,public activityDetail:ActivityDetailService,private databaseService:DatabaseService) {
    this.dataProvider.currentBusiness.pipe(debounceTime(100)).subscribe(async (business)=>{
      this.databaseService.getCurrentSettings(business.businessId).then((settings)=>{
        console.log("settings",settings);
        if(settings){
          this.dataProvider.businessData = settings;
        }
      })
      if (this.salesChartJS){
        this.salesChartJS.destroy();
      }
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
      console.log("Created chart instance",this.salesChartJS);
      if (business.businessId == 'all'){
        let loader =await this.loadingCtrl.create({
          message:'Loading all outlets data'
        });
        await loader.present();
        await this.loadMultipleOutletData(this.dateRangeFormGroup.value.startDate,this.dataProvider.allBusiness,this.dateRangeFormGroup.value.endDate)
        loader.dismiss();
        // this.dateRangeFormGroup.valueChanges.pipe(debounceTime(700)).subscribe(async (value)=>{
        //   await loader.present();
        //   await this.loadMultipleOutletData(value.startDate,this.dataProvider.allBusiness,value.endDate)
        //   loader.dismiss();
        // });
      } else {
        console.log("business",business);
        this.loadData(new Date(),business);
        this.dateRangeFormGroup.valueChanges.pipe(debounceTime(700)).subscribe(async (value)=>{
          this.loadData(value.startDate,business,value.endDate);
        });
      }
    });

    // this.multipleOutletAnalyticsDataModified.subscribe(()=>{
    //   console.log("Merging");
    //   this.allOutletAnalyticsData = this.analyticsService.mergeAnalyticsData(this.multipleOutletAnalyticsData);
    //   this.attachData(this.allOutletAnalyticsData);
    //   console.log("this.multipleOutletAnalyticsData",this.multipleOutletAnalyticsData,this.allOutletAnalyticsData);
    // });
  }


  async loadMultipleOutletData(startDate:Date,outlets:UserBusiness[],endDate?:Date){
    // subscribe to all of them for data and then next the multipleOutletAnalyticsDataModified subject
    this.multipleOutletAnalyticsData = [];
    let receivedOutletCounter = 0;
    for (let i = 0; i < outlets.length; i++) {
      const outlet = outlets[i];
      let data = await this.analyticsService.getAnalytics(startDate,outlet.businessId,endDate);
      console.log("Getting data for ",data,this.multipleOutletAnalyticsData,i);
      receivedOutletCounter++;
      if (data){
        this.multipleOutletAnalyticsData.push(data);
      }
      if (receivedOutletCounter == outlets.length){
        this.allOutletAnalyticsData = this.analyticsService.mergeAnalyticsData(this.multipleOutletAnalyticsData);
        console.log("ALL DONE: this.multipleOutletAnalyticsData",this.multipleOutletAnalyticsData,this.multipleOutletAnalyticsData.length,this.allOutletAnalyticsData);
        this.attachData(this.allOutletAnalyticsData);
      }
    }
  }

  async refreshData(){
    let business = await firstValueFrom(this.dataProvider.currentBusiness);
    let loader =await this.loadingCtrl.create({
      message:'Refreshing data please wait...'
    });
    await loader.present();
    console.log({businessId:business.businessId});
    this.analyzeAnalyticsForBusiness({businessId:business.businessId}).then((result:any)=>{
      console.log("Result",result);
      this.alertify.presentToast("Data refreshed successfully");
      this.dataProvider.currentBusiness.next(business);
      this.loadData(new Date(),business);
    }).catch((e)=>{
      this.alertify.presentToast("Error refreshing data");
    }).finally(()=>{
      loader.dismiss();
    });
  }


  async loadData(startDate:Date,business:UserBusiness,endDate?:Date){
    let loader = await this.loadingCtrl.create({
      message: 'Please wait...',
    });
    await loader.present();
    this.analyticsService.getAnalytics(startDate,business.businessId,endDate,true).then((analytics)=>{
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
  }

  switchPaymentChannel(channel: string) {
    this.paymentReceivedChannelWise.currentChannel = this.paymentReceivedChannelWise[channel];
  }

  attachData(data:AnalyticsData){
    if (data){
      if(this.salesChartJS){
        console.log("data.salesChannels.all.hourlySales",data.salesChannels.all.hourlySales,this.salesChartJS.ctx);
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
