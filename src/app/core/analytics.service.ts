import { Injectable } from '@angular/core';
import { Firestore, Timestamp, doc, docData, getDoc } from '@angular/fire/firestore';
import { AnalyticsData } from '../admin/activity/sales/sales.page';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  cachedData:{date:Date,data:AnalyticsData,business:string}[] = [];
  constructor(private firestore:Firestore) { }

  resetVariables(){
    this.cachedData = [];
  }

  async getAnalytics(date:Date,businessId:string,endDate?:Date){
    let docRefs = [];
    let docRef = doc(this.firestore,'business',businessId,'analyticsData',(date.getFullYear().toString() + '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0')))
    console.log("Fetching for ",docRef.path);
    docRefs.push({
      ref:docRef,
      date:date
    });
    if (endDate && this.matchDay(date,endDate) === false) {
      // get list of dates between start and end date
      let dates:Date[] =[];
      let currentDate = new Date(date);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      console.log("Dates",dates);
      // set dateString in this format 2023-09-30
      // add the missing zero in month and date
      let dateString = 
      dates.forEach((date)=>{
        docRefs.push(
          {
            ref:doc(this.firestore,'business',businessId,'analyticsData',(date.getFullYear().toString() + '-' + (date.getMonth()+1).toString().padStart(2,'0') + '-' + date.getDate().toString().padStart(2,'0'))),
            date:date
          }
        )
      });
      let data = await Promise.all(docRefs.map(async (docRef)=>{
        let data = await getDoc(docRef.ref);
        console.log("Fetching for ",docRef.ref.path);
        return {
          date:docRef.date,
          data:data.data() as AnalyticsData
        }
      }));
      return this.mergeAnalyticsData(data.map((data)=>{
        return data.data;
      }).filter((data)=>data));
    } else {
      let data = await getDoc(docRef);
      return data.data() as AnalyticsData;
    }
  }

  mergeAnalyticsData(multipleAnalyticsData:AnalyticsData[]){
    console.log("Analytics data received: ",multipleAnalyticsData.length);
    let analyticsData: AnalyticsData = {
      createdAt: Timestamp.fromDate(new Date()),
      createdAtUTC: new Date().toUTCString(),
      salesChannels: {
        all: {
          totalSales: 0,
          netSales: 0,
          totalDiscount: 0,
          totalNC: 0,
          totalTaxes: 0,
          totalSettledBills: 0,
          totalDiscountedBills: 0,
          totalNcBills: 0,
          totalUnsettledBills: 0,
          totalCancelled:0,
          totalCancelledBills:0,
          hourlySales: [...new Array(24).fill(0)],
          averageHourlySales: [],
          paymentReceived: {},
          billWiseSales: {
            rangeWise: {
              lowRange: {
                bills: [],
                totalSales: 0,
              },
              mediumRange: {
                bills: [],
                totalSales: 0,
              },
              highRange: {
                bills: [],
                totalSales: 0,
              },
            },
            tableWise: [],
            time: [],
            maxTables: 0,
          },
          maxBillsInRange:0,
          itemWiseSales: {
            byPrice: [],
            byQuantity: [],
            byPriceMax: 0,
            byQuantityMax: 0,
            priceTopCategory:{},
            quantityTopCategory:{},
          },
          suspiciousActivities: [],
          userWiseActions: [
            {
              userId: '',
              userRef: null,
              actions: {
                bills: [],
                kots: [],
                discounts: [],
                settlements: [],
                ncs: [],
              },
            },
          ],
        },
        dineIn: {
          totalSales: 0,
          netSales: 0,
          totalDiscount: 0,
          totalNC: 0,
          totalTaxes: 0,
          totalSettledBills: 0,
          totalDiscountedBills: 0,
          totalNcBills: 0,
          totalUnsettledBills: 0,
          totalCancelled:0,
          totalCancelledBills:0,
          hourlySales: [],
          averageHourlySales: [],
          paymentReceived: {},
          maxBillsInRange:0,
          billWiseSales: {
            rangeWise: {
              lowRange: {
                bills: [],
                totalSales: 0,
              },
              mediumRange: {
                bills: [],
                totalSales: 0,
              },
              highRange: {
                bills: [],
                totalSales: 0,
              },
            },
            tableWise: [],
            time: [],
            maxTables: 0,
          },
          itemWiseSales: {
            byPrice: [],
            byQuantity: [],
            byPriceMax: 0,
            byQuantityMax: 0,
            priceTopCategory:{},
            quantityTopCategory:{},
          },
          suspiciousActivities: [],
          userWiseActions: [
            {
              userId: '',
              userRef: null,
              actions: {
                bills: [],
                kots: [],
                discounts: [],
                settlements: [],
                ncs: [],
              },
            },
          ],
        },
        takeaway: {
          totalSales: 0,
          netSales: 0,
          totalDiscount: 0,
          totalNC: 0,
          totalTaxes: 0,
          totalSettledBills: 0,
          totalDiscountedBills: 0,
          totalNcBills: 0,
          totalUnsettledBills: 0,
          totalCancelled:0,
          totalCancelledBills:0,
          hourlySales: [],
          averageHourlySales: [],
          paymentReceived: {},
          maxBillsInRange:0,
          billWiseSales: {
            rangeWise: {
              lowRange: {
                bills: [],
                totalSales: 0,
              },
              mediumRange: {
                bills: [],
                totalSales: 0,
              },
              highRange: {
                bills: [],
                totalSales: 0,
              },
            },
            tableWise: [],
            time: [],
            maxTables: 0,
          },
          itemWiseSales: {
            byPrice: [],
            byQuantity: [],
            byPriceMax: 0,
            byQuantityMax: 0,
            priceTopCategory:{},
            quantityTopCategory:{},
          },
          suspiciousActivities: [],
          userWiseActions: [
            {
              userId: '',
              userRef: null,
              actions: {
                bills: [],
                kots: [],
                discounts: [],
                settlements: [],
                ncs: [],
              },
            },
          ],
        },
        online: {
          totalSales: 0,
          netSales: 0,
          totalDiscount: 0,
          totalNC: 0,
          totalTaxes: 0,
          totalSettledBills: 0,
          totalDiscountedBills: 0,
          totalNcBills: 0,
          totalUnsettledBills: 0,
          totalCancelled:0,
          totalCancelledBills:0,
          hourlySales: [],
          averageHourlySales: [],
          paymentReceived: {},
          maxBillsInRange:0,
          billWiseSales: {
            rangeWise: {
              lowRange: {
                bills: [],
                totalSales: 0,
              },
              mediumRange: {
                bills: [],
                totalSales: 0,
              },
              highRange: {
                bills: [],
                totalSales: 0,
              },
            },
            tableWise: [],
            time: [],
            maxTables: 0,
          },
          itemWiseSales: {
            byPrice: [],
            byQuantity: [],
            byPriceMax: 0,
            byQuantityMax: 0,
            priceTopCategory:{},
            quantityTopCategory:{},
          },
          suspiciousActivities: [],
          userWiseActions: [
            {
              userId: '',
              userRef: null,
              actions: {
                bills: [],
                kots: [],
                discounts: [],
                settlements: [],
                ncs: [],
              },
            },
          ],
        },
      },
      customersData: {
        totalCustomers: 0,
        totalCustomersByChannel: {
          dineIn: 0,
          takeaway: 0,
          online: 0,
        },
        totalNewCustomers: 0,
        totalNewCustomersByChannel: {
          dineIn: 0,
          takeaway: 0,
          online: 0,
        },
        newCustomers: [],
        allCustomers: [],
      },
    };
    // merge all days analytics data into one
    multipleAnalyticsData.forEach((analytics) => {
      analyticsData.salesChannels.all.totalSales += analytics.salesChannels.all.totalSales;
      analyticsData.salesChannels.all.netSales += analytics.salesChannels.all.netSales;
      analyticsData.salesChannels.all.totalDiscount += analytics.salesChannels.all.totalDiscount;
      analyticsData.salesChannels.all.totalNC += analytics.salesChannels.all.totalNC;
      analyticsData.salesChannels.all.totalTaxes += analytics.salesChannels.all.totalTaxes;
      analyticsData.salesChannels.all.totalSettledBills += analytics.salesChannels.all.totalSettledBills;
      analyticsData.salesChannels.all.totalUnsettledBills += analytics.salesChannels.all.totalUnsettledBills;
      analyticsData.salesChannels.all.totalDiscountedBills += analytics.salesChannels.all.totalDiscountedBills;
      analyticsData.salesChannels.all.totalNcBills += analytics.salesChannels.all.totalNcBills;
      analyticsData.salesChannels.all.totalCancelled += analytics.salesChannels.all.totalCancelled;
      analyticsData.salesChannels.all.totalCancelledBills += analytics.salesChannels.all.totalCancelledBills;
      analyticsData.salesChannels.all.hourlySales = analyticsData.salesChannels.all.hourlySales.map((value, index) => {
        return value + analytics.salesChannels.all.hourlySales[index];
      });
      analyticsData.salesChannels.all.paymentReceived = this.mergePaymentReceived(
        analyticsData.salesChannels.all.paymentReceived,
        analytics.salesChannels.all.paymentReceived
      );
      analyticsData.salesChannels.all.billWiseSales = this.mergeBillWiseSales(
        analyticsData.salesChannels.all.billWiseSales,
        analytics.salesChannels.all.billWiseSales,
      );
      analyticsData.salesChannels.all.maxBillsInRange = Math.max(analyticsData.salesChannels.all.maxBillsInRange,analytics.salesChannels.all.maxBillsInRange);
      analyticsData.salesChannels.all.itemWiseSales = this.mergeItemWiseSales(
        analyticsData.salesChannels.all.itemWiseSales,
        analytics.salesChannels.all.itemWiseSales,
      );
      analyticsData.salesChannels.all.suspiciousActivities = [
        ...analyticsData.salesChannels.all.suspiciousActivities,
        ...analytics.salesChannels.all.suspiciousActivities,
      ];
      analyticsData.salesChannels.all.userWiseActions = this.mergeUserWiseActions(
        analyticsData.salesChannels.all.userWiseActions,
        analytics.salesChannels.all.userWiseActions,
      );
      analyticsData.salesChannels.dineIn.totalSales += analytics.salesChannels.dineIn.totalSales;
      analyticsData.salesChannels.dineIn.netSales += analytics.salesChannels.dineIn.netSales;
      analyticsData.salesChannels.dineIn.totalDiscount += analytics.salesChannels.dineIn.totalDiscount;
      analyticsData.salesChannels.dineIn.totalNC += analytics.salesChannels.dineIn.totalNC;
      analyticsData.salesChannels.dineIn.totalTaxes += analytics.salesChannels.dineIn.totalTaxes;
      analyticsData.salesChannels.dineIn.totalSettledBills += analytics.salesChannels.dineIn.totalSettledBills;
      analyticsData.salesChannels.dineIn.totalUnsettledBills += analytics.salesChannels.dineIn.totalUnsettledBills;
      analyticsData.salesChannels.dineIn.totalDiscountedBills += analytics.salesChannels.dineIn.totalDiscountedBills;
      analyticsData.salesChannels.dineIn.totalNcBills += analytics.salesChannels.dineIn.totalNcBills;
      analyticsData.salesChannels.dineIn.totalCancelled += analytics.salesChannels.dineIn.totalCancelled;
      analyticsData.salesChannels.dineIn.totalCancelledBills += analytics.salesChannels.dineIn.totalCancelledBills;
      analyticsData.salesChannels.dineIn.hourlySales = analyticsData.salesChannels.dineIn.hourlySales.map((value, index) => {
        return value + analytics.salesChannels.dineIn.hourlySales[index];
      }
      );
      analyticsData.salesChannels.dineIn.paymentReceived = this.mergePaymentReceived(
        analyticsData.salesChannels.dineIn.paymentReceived,
        analytics.salesChannels.dineIn.paymentReceived
      );
      analyticsData.salesChannels.dineIn.billWiseSales = this.mergeBillWiseSales(
        analyticsData.salesChannels.dineIn.billWiseSales,
        analytics.salesChannels.dineIn.billWiseSales,
      );
      analyticsData.salesChannels.dineIn.maxBillsInRange = Math.max(analyticsData.salesChannels.dineIn.maxBillsInRange,analytics.salesChannels.dineIn.maxBillsInRange);
      analyticsData.salesChannels.dineIn.itemWiseSales = this.mergeItemWiseSales(
        analyticsData.salesChannels.dineIn.itemWiseSales,
        analytics.salesChannels.dineIn.itemWiseSales,
      );
      analyticsData.salesChannels.dineIn.suspiciousActivities = [
        ...analyticsData.salesChannels.dineIn.suspiciousActivities,
        ...analytics.salesChannels.dineIn.suspiciousActivities,
      ];
      analyticsData.salesChannels.dineIn.userWiseActions = this.mergeUserWiseActions(
        analyticsData.salesChannels.dineIn.userWiseActions,
        analytics.salesChannels.dineIn.userWiseActions,
      );
      analyticsData.salesChannels.takeaway.totalSales += analytics.salesChannels.takeaway.totalSales;
      analyticsData.salesChannels.takeaway.netSales += analytics.salesChannels.takeaway.netSales;
      analyticsData.salesChannels.takeaway.totalDiscount += analytics.salesChannels.takeaway.totalDiscount;
      analyticsData.salesChannels.takeaway.totalNC += analytics.salesChannels.takeaway.totalNC;
      analyticsData.salesChannels.takeaway.totalTaxes += analytics.salesChannels.takeaway.totalTaxes;
      analyticsData.salesChannels.takeaway.totalSettledBills += analytics.salesChannels.takeaway.totalSettledBills;
      analyticsData.salesChannels.takeaway.totalUnsettledBills += analytics.salesChannels.takeaway.totalUnsettledBills;
      analyticsData.salesChannels.takeaway.totalDiscountedBills += analytics.salesChannels.takeaway.totalDiscountedBills;
      analyticsData.salesChannels.takeaway.totalNcBills += analytics.salesChannels.takeaway.totalNcBills;
      analyticsData.salesChannels.takeaway.totalCancelled += analytics.salesChannels.dineIn.totalCancelled;
      analyticsData.salesChannels.takeaway.totalCancelledBills += analytics.salesChannels.dineIn.totalCancelledBills;
      analyticsData.salesChannels.takeaway.hourlySales = analyticsData.salesChannels.takeaway.hourlySales.map((value, index) => {
        return value + analytics.salesChannels.takeaway.hourlySales[index];
      }
      );
      analyticsData.salesChannels.takeaway.paymentReceived = this.mergePaymentReceived(
        analyticsData.salesChannels.takeaway.paymentReceived,
        analytics.salesChannels.takeaway.paymentReceived
      );
      analyticsData.salesChannels.takeaway.billWiseSales = this.mergeBillWiseSales(
        analyticsData.salesChannels.takeaway.billWiseSales,
        analytics.salesChannels.takeaway.billWiseSales,
      );
      analyticsData.salesChannels.takeaway.maxBillsInRange = Math.max(analyticsData.salesChannels.takeaway.maxBillsInRange,analytics.salesChannels.takeaway.maxBillsInRange);
      analyticsData.salesChannels.takeaway.itemWiseSales = this.mergeItemWiseSales(
        analyticsData.salesChannels.takeaway.itemWiseSales,
        analytics.salesChannels.takeaway.itemWiseSales,
      );
      analyticsData.salesChannels.takeaway.suspiciousActivities = [
        ...analyticsData.salesChannels.takeaway.suspiciousActivities,
        ...analytics.salesChannels.takeaway.suspiciousActivities,
      ];
      analyticsData.salesChannels.takeaway.userWiseActions = this.mergeUserWiseActions(
        analyticsData.salesChannels.takeaway.userWiseActions,
        analytics.salesChannels.takeaway.userWiseActions,
      );
      analyticsData.salesChannels.online.totalSales += analytics.salesChannels.online.totalSales;
      analyticsData.salesChannels.online.netSales += analytics.salesChannels.online.netSales;
      analyticsData.salesChannels.online.totalDiscount += analytics.salesChannels.online.totalDiscount;
      analyticsData.salesChannels.online.totalNC += analytics.salesChannels.online.totalNC;
      analyticsData.salesChannels.online.totalTaxes += analytics.salesChannels.online.totalTaxes;
      analyticsData.salesChannels.online.totalSettledBills += analytics.salesChannels.online.totalSettledBills;
      analyticsData.salesChannels.online.totalUnsettledBills += analytics.salesChannels.online.totalUnsettledBills;
      analyticsData.salesChannels.online.totalDiscountedBills += analytics.salesChannels.online.totalDiscountedBills;
      analyticsData.salesChannels.online.totalNcBills += analytics.salesChannels.online.totalNcBills;
      analyticsData.salesChannels.online.totalCancelled += analytics.salesChannels.dineIn.totalCancelled;
      analyticsData.salesChannels.online.totalCancelledBills += analytics.salesChannels.dineIn.totalCancelledBills;
      analyticsData.salesChannels.online.hourlySales = analyticsData.salesChannels.online.hourlySales.map((value, index) => {
        return value + analytics.salesChannels.online.hourlySales[index];
      }
      );
      analyticsData.salesChannels.online.paymentReceived = this.mergePaymentReceived(
        analyticsData.salesChannels.online.paymentReceived,
        analytics.salesChannels.online.paymentReceived
      );
      analyticsData.salesChannels.online.billWiseSales = this.mergeBillWiseSales(
        analyticsData.salesChannels.online.billWiseSales,
        analytics.salesChannels.online.billWiseSales,
      );
      analyticsData.salesChannels.online.maxBillsInRange = Math.max(analyticsData.salesChannels.online.maxBillsInRange,analytics.salesChannels.online.maxBillsInRange);
      analyticsData.salesChannels.online.itemWiseSales = this.mergeItemWiseSales(
        analyticsData.salesChannels.online.itemWiseSales,
        analytics.salesChannels.online.itemWiseSales,
      );
      analyticsData.salesChannels.online.suspiciousActivities = [
        ...analyticsData.salesChannels.online.suspiciousActivities,
        ...analytics.salesChannels.online.suspiciousActivities,
      ];
      analyticsData.salesChannels.online.userWiseActions = this.mergeUserWiseActions(
        analyticsData.salesChannels.online.userWiseActions,
        analytics.salesChannels.online.userWiseActions,
      );
      analyticsData.customersData.totalCustomers += analytics.customersData.totalCustomers;
      analyticsData.customersData.totalCustomersByChannel.dineIn += analytics.customersData.totalCustomersByChannel.dineIn;
      analyticsData.customersData.totalCustomersByChannel.takeaway += analytics.customersData.totalCustomersByChannel.takeaway;
      analyticsData.customersData.totalCustomersByChannel.online += analytics.customersData.totalCustomersByChannel.online;
      analyticsData.customersData.totalNewCustomers += analytics.customersData.totalNewCustomers;
      analyticsData.customersData.totalNewCustomersByChannel.dineIn += analytics.customersData.totalNewCustomersByChannel.dineIn;
      analyticsData.customersData.totalNewCustomersByChannel.takeaway += analytics.customersData.totalNewCustomersByChannel.takeaway;
      analyticsData.customersData.totalNewCustomersByChannel.online += analytics.customersData.totalNewCustomersByChannel.online;
      analyticsData.customersData.newCustomers = [
        ...analyticsData.customersData.newCustomers,
        ...analytics.customersData.newCustomers,
      ];
      analyticsData.customersData.allCustomers = [
        ...analyticsData.customersData.allCustomers,
        ...analytics.customersData.allCustomers,
      ];
    });
    // calculate average hourly sales
    analyticsData.salesChannels.all.averageHourlySales = analyticsData.salesChannels.all.hourlySales.map((value) => {
      return value / multipleAnalyticsData.length;
    }
    );
    analyticsData.salesChannels.dineIn.averageHourlySales = analyticsData.salesChannels.dineIn.hourlySales.map((value) => {
      return value / multipleAnalyticsData.length;
    }
    );
    analyticsData.salesChannels.takeaway.averageHourlySales = analyticsData.salesChannels.takeaway.hourlySales.map((value) => {
      return value / multipleAnalyticsData.length;
    }
    );
    analyticsData.salesChannels.online.averageHourlySales = analyticsData.salesChannels.online.hourlySales.map((value) => {
      return value / multipleAnalyticsData.length;
    }
    );
    return analyticsData;
  }

  mergePaymentReceived(paymentReceived2: any, paymentReceived1: any) {
    // console.log("Merging",paymentReceived2,paymentReceived1);
    let paymentReceived:any = {};
    let keys = new Set([...Object.keys(paymentReceived1),...Object.keys(paymentReceived2)]);
    keys.forEach((key) => {
      paymentReceived[key] = (paymentReceived1[key]||0) + (paymentReceived2[key]||0);
    })
    return paymentReceived;
  }

  mergeBillWiseSales(billWiseSales1: any, billWiseSales2: any) {
    let billWiseSales:any = {
      rangeWise: {
        lowRange: {
          bills: [
            ...billWiseSales1.rangeWise.lowRange.bills,
            ...billWiseSales2.rangeWise.lowRange.bills,
          ],
          totalSales: billWiseSales1.rangeWise.lowRange.totalSales + billWiseSales2.rangeWise.lowRange.totalSales,
        },
        mediumRange: {
          bills: [
            ...billWiseSales1.rangeWise.mediumRange.bills,
            ...billWiseSales2.rangeWise.mediumRange.bills,
          ],
          totalSales: billWiseSales1.rangeWise.mediumRange.totalSales + billWiseSales2.rangeWise.mediumRange.totalSales,
        },
        highRange: {
          bills: [
            ...billWiseSales1.rangeWise.highRange.bills,
            ...billWiseSales2.rangeWise.highRange.bills,
          ],
          totalSales: billWiseSales1.rangeWise.highRange.totalSales + billWiseSales2.rangeWise.highRange.totalSales,
        },
      },
      tableWise: [
        ...billWiseSales1.tableWise,
        ...billWiseSales2.tableWise,
      ],
      time: [
        ...billWiseSales1.time,
        ...billWiseSales2.time,
      ],
      maxTables: Math.max(billWiseSales1.maxTables, billWiseSales2.maxTables),
    };
    return billWiseSales;
  }

  mergeItemWiseSales(itemWiseSales1: any, itemWiseSales2: any) {
    let itemWiseSales:any = {
      byPrice: [
        ...itemWiseSales1.byPrice,
        ...itemWiseSales2.byPrice,
      ],
      byQuantity: [
        ...itemWiseSales1.byQuantity,
        ...itemWiseSales2.byQuantity,
      ],
      byPriceMax: Math.max(itemWiseSales1.byPriceMax, itemWiseSales2.byPriceMax),
      byQuantityMax: Math.max(itemWiseSales1.byQuantityMax, itemWiseSales2.byQuantityMax),
      priceTopCategory:{},
      quantityTopCategory:{},
    };
    return itemWiseSales;
  }

  mergeUserWiseActions(userWiseActions1: any, userWiseActions2: any) {
    let userWiseActions:any = [
      ...userWiseActions1,
      ...userWiseActions2,
    ];
    return userWiseActions;
  }

  matchDay(dayOne:Date,dayTwo:Date){
    // check month year and day
    return dayOne.getFullYear() === dayTwo.getFullYear() && dayOne.getMonth() === dayTwo.getMonth() && dayOne.getDate() === dayTwo.getDate();
  }


}
