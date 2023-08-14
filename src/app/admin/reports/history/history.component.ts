import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Fuse from 'fuse.js';
import { Subject, debounceTime } from 'rxjs';
import { BillConstructor, PrintableBill } from 'src/app/core/types/bill.structure';
import { ReportService } from '../report.service';
import { KotConstructor } from 'src/app/core/types/kot.structure';
import { ModalController, PopoverController } from '@ionic/angular';
import { BillPreviewComponent } from 'src/app/widgets/bill-preview/bill-preview.component';
import { BusinessRecord, UserRecord } from 'src/app/core/types/user.structure';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { DatabaseService } from 'src/app/core/services/database/database.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KotPreviewComponent } from 'src/app/widgets/kot-preview/kot-preview.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent  implements OnInit {
  selectedModes = [
    {
      name: 'Dine In',
      value: 'dineIn',
      selected: true
    },
    {
      name: 'Take Away',
      value: 'takeAway',
      selected: false
    },
    {
      name: 'Online',
      value: 'online',
      selected: false
    }
  ];
  currentBusiness:BusinessRecord|null = null;
  totalSales: number = 0;
  groupByTable: boolean = false;
  groupByDate: boolean = false;
  loading: boolean = false;
  minimumAmount: number = 0;
  totalKots: number = 0;
  totalBills: number = 0;
  startingKotNumber:string | undefined = '0';
  endingKotNumber:string | undefined = '0';
  // mode vars
  currentMode: 'all' | 'dineIn' | 'takeaway' | 'online' = 'all';

  // Reports
  bills: ExtendedBillConstructor[] = [];
  filteredBills: ExtendedBillConstructor[] = [];
  fuseSearchInstance = new Fuse(this.bills, { keys: ['billNo', 'orderNo'] });
  numberSearchSubject: Subject<string> = new Subject<string>();
  constructor(private reportService:ReportService,private modalController:ModalController,private dataProvider:DataProvider,private databaseService:DatabaseService,public changeDetectorRef:ChangeDetectorRef) {
    this.numberSearchSubject.pipe(debounceTime(600)).subscribe((searchTerm) => {
      if (searchTerm.length > 0) {
        this.filteredBills = this.fuseSearchInstance
          .search(searchTerm)
          .map((result) => {
            return result.item;
          });
        //  console.log("filteredBills",this.filteredBills);
      } else {
        this.filteredBills = [];
      }
    });
    this.dataProvider.currentBusiness.subscribe((business)=>{
      console.log("menu",business);
      this.databaseService.getCurrentSettings(business.businessId).then((settings)=>{
        console.log("settings",settings);
        if(settings){
          this.dataProvider.businessData = settings;
          this.getReport(business.businessId);
        }
      })
      this.dateRangeFormGroup.valueChanges.subscribe((value) => {
        console.log('Picker range changed', value);
        if (this.dateRangeFormGroup.valid) {
          this.getReport(business.businessId);
        }
      });
    });
  }
  dateRangeFormGroup:FormGroup = new FormGroup({
    startDate:new FormControl(null,[Validators.required]),
    endDate:new FormControl(null,[Validators.required])
  });

  setDate(picker:any){
    console.log("picker",picker);
  }

  switchOtherModes(index:number){
    this.selectedModes.forEach((mode,modeIndex)=>{
      if(modeIndex!=index){
        mode.selected = false;
      }
    })
  }
  

  endDateChanged(value: any) {
    console.log('value', value);
  }

  ngOnInit(): void {
    // patch value of dateRangeFormGroup with current date as startDate and endDate
    this.dateRangeFormGroup.patchValue({
      startDate: new Date(),
      endDate: new Date(),
    });
  }

  regenerateStats() {
    this.totalSales = 0;
    this.endingKotNumber = '';
    this.totalKots = 0;
    this.totalBills = 0;
    this.startingKotNumber = '';
    this.endingKotNumber = '';
    let filteredBills = this.bills.filter((bill) => {
      return this.currentMode == 'all' || bill.mode == this.currentMode;
    });
    filteredBills.forEach((bill) => {
      // recalculate stats totalSales, startKot, endKot, totalKots, totalBills, startingKotNumber, endingKotNumber
      this.totalSales += bill.billing.grandTotal;
      this.totalKots += bill.kots.length;
      this.totalBills++;
      if (this.startingKotNumber == '') {
        this.startingKotNumber = bill.kots[0].id;
      }
      this.endingKotNumber = bill.kots[bill.kots.length - 1].id;
    });
  }

  getReport(businessId:string) {
    this.reportService
      .getBillsByDay(
        this.dateRangeFormGroup.value.startDate,
        businessId,
        this.dateRangeFormGroup.value.endDate,
      )
      .then((bills:any) => {
         console.log("bills",bills.docs);
        this.bills = bills.docs.map((doc:any) => {
          let allProducts = doc.data().kots.reduce((acc:any, kot:any) => {
            acc.push(...kot.products);
            return acc;
          }, [] as any[]);
          console.log('BILL: ', doc.data());

          return {
            ...doc.data(),
            id: doc.id,
            kotVisible: false,
            flipped: false,
            kotOrBillVisible: false,
          } as ExtendedBillConstructor;
        });
        this.totalKots = this.bills.reduce((acc, bill) => {
          return acc + bill.kots.length;
        }, 0);
        this.totalBills = this.bills.length;
        this.totalSales = this.bills.reduce((acc, bill) => {
          return acc + bill.billing.grandTotal;
        }, 0);
        this.regenerateStats();
        this.fuseSearchInstance.setCollection(this.bills);
        this.loading = false;
      }).catch((error)=>{
        console.log("error",error);
      });
  }

  getGroupsByTable(bills: BillConstructor[]) {
    let groups = bills.reduce(
      (acc, bill) => {
        let index = acc.findIndex((group) => group.table == bill.table);
        if (index == -1) {
          acc.push({ table: bill.table, bills: [bill] });
        } else {
          acc[index].bills.push(bill);
        }
        return acc;
      },
      [] as { table: { id: string; name: string }; bills: BillConstructor[] }[],
    );
    return groups;
  }

  async reprintBill(bill: BillConstructor) {
    
  }

  async reprintKot(kot: KotConstructor, bill: BillConstructor) {
    
  }

  generateConsolidatedReport() {
    let filteredBills = this.bills.filter(
      (bill) =>
        bill.billing.grandTotal >= this.minimumAmount &&
        bill.stage == 'settled',
    );

  }


  getModeTitle(mode: 'dineIn' | 'takeaway' | 'online'): string {
    if (mode == 'dineIn') {
      return 'Table';
    } else if (mode == 'takeaway') {
      return 'Token';
    } else if (mode == 'online') {
      return 'Order';
    } else {
      return 'Table';
    }
  }

  exportToPdf() {
    // do it by selected mode
    let filteredBills = this.bills.filter(
      (bill) => this.currentMode == 'all' || bill.mode == this.currentMode,
    );
    // create a jspdf doc with autotable
    // heading should be Bill No, Order No, Table, Time, Total, Mode
    // body should be the filtered bills
    // export to excel

    let doc = new jsPDF();
    autoTable(doc, {
      head: [
        ['Total KOT', 'Total Bills', 'Starting KOT', 'End KOT', 'Total Sales'],
      ],
      body: [
        [
          this.totalKots,
          this.totalBills,
          this.startingKotNumber || '',
          this.endingKotNumber || '',
          this.totalSales,
        ],
      ],
    });
    autoTable(doc, {
      head: [['Time', 'Mode', 'Table', 'Bill No', 'Order No', 'Total']],
      body: [
        ...filteredBills.map((bill: any) => {
          return [
            bill.createdDate.toDate().toLocaleString(),
            bill.mode,
            bill.table,
            bill.billNo,
            bill.orderNo,
            bill.billing.grandTotal,
          ];
        }),
      ],
    });
    doc.save('Bills Report.pdf');
  }

  exportToExcel() {
    // generate a csv file exactly same as exportToPdf function
    let filteredBills = this.bills.filter(
      (bill) => this.currentMode == 'all' || bill.mode == this.currentMode,
    );
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Total KOT,Total Bills,Starting KOT,End KOT,Total Sales\n';
    csvContent +=
      this.totalKots +
      ',' +
      this.totalBills +
      ',' +
      this.startingKotNumber +
      ',' +
      this.endingKotNumber +
      ',' +
      this.totalSales +
      '\n';
    csvContent += 'Time,Mode,Table,Bill No,Order No,Total\n';
    filteredBills.forEach((bill: any) => {
      csvContent +=
        bill.createdDate.toDate().toLocaleString().replace(',', ' ') +
        ',' +
        bill.mode +
        ',' +
        bill.table +
        ',' +
        bill.billNo +
        ',' +
        bill.orderNo +
        ',' +
        bill.billing.grandTotal +
        '\n';
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Bills Report.csv');
    document.body.appendChild(link); // Required for FF
    link.click();
  }

  async viewBill(billConstructor:BillConstructor){
    let printableBillData = this.printableBillGenerator(
      billConstructor,
      billConstructor.kots.reduce((acc, kot) => {
        acc.push(...kot.products);
        return acc;
      }, [] as any[]),
      this.dataProvider.businessData,
      '',
      this.dataProvider.currentUser!.uid,
      '',
    );
    console.log('printableBillData', printableBillData);
    let popover = await this.modalController.create({
      component:BillPreviewComponent,
      initialBreakpoint:0.7,
      breakpoints:[0.2,0.5,0.7,1],
      componentProps:{
        printableBillData:printableBillData
      }
    });
    popover.present();
  }

  async viewKots(billConstructor:BillConstructor){
    let popover = await this.modalController.create({
      component:KotPreviewComponent,
      initialBreakpoint:0.7,
      breakpoints:[0.2,0.5,0.7,1],
      componentProps:{
        bill:billConstructor
      }
    });
    popover.present();
  }

  printableBillGenerator(
    bill: BillConstructor,
    products: any[],
    currentBusiness: BusinessRecord,
    billNoSuffix: string,
    currentUser:string,
    customBillNote: string,
  ): PrintableBill {
    return {
      businessDetails: {
        address: currentBusiness.address,
        email: currentBusiness.email,
        fssai: currentBusiness.fssai,
        gstin: currentBusiness.gst,
        name: currentBusiness.hotelName,
        phone: currentBusiness.phone,
      },
      customerDetail: {
        address: bill.customerInfo.address,
        gstin: bill.customerInfo.gst,
        name: bill.customerInfo.name,
        phone: bill.customerInfo.phone,
      },
      currentLoyalty: bill.currentLoyalty,
      postDiscountSubTotal:bill.billing.postDiscountSubTotal,
      billNoSuffix: billNoSuffix,
      billNo: bill.billNo || '',
      orderNo: bill.orderNo || '',
      cashierName: currentUser,
      // date in dd/mm/yyyy format
      date: bill.createdDate.toDate().toLocaleDateString('en-GB'),
      // time in 12 hour format
      time: bill.createdDate.toDate().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      }),
      mode:
        bill.mode == 'dineIn'
          ? 'Dine In'
          : bill.mode == 'online'
          ? 'Online'
          : bill.mode == 'takeaway'
          ? 'Takeaway'
          : 'Dine In',
      products: products.map((product) => {
        return {
          id: product.id,
          name: product.name,
          quantity: product.quantity,
          untaxedValue: product.price,
          total: product.untaxedValue,
        };
      }),
      totalQuantity: products.reduce((acc, product) => {
        return acc + product.quantity;
      }, 0),
      subTotal: roundOffPipe(bill.billing.subTotal),
      discounts: bill.billing.discount.map((discount) => {
        if (discount.mode == 'codeBased') {
          return {
            name: discount.name,
            rate: roundOffPipe(discount.value),
            type: discount.type,
            value: roundOffPipe(discount.totalAppliedDiscount),
          };
        } else if (discount.mode == 'directFlat') {
          return {
            name: 'Flat',
            rate: roundOffPipe(discount.value),
            value: roundOffPipe(discount.totalAppliedDiscount),
            type: 'flat',
          };
        } else {
          return {
            name: 'Offer',
            rate: roundOffPipe(discount.value),
            type: 'percentage',
            value: roundOffPipe(discount.totalAppliedDiscount),
          };
        }
      }),
      taxes: bill.billing.taxes.map((tax) => {
        return {
          name: tax.name,
          rate: roundOffPipe(tax.cost),
          value: roundOffPipe(tax.amount),
        };
      }),
      grandTotal: roundOffPipe(bill.billing.grandTotal),
      note: customBillNote,
      notes: bill.instruction ? [bill.instruction] : [],
    };
  }
  
}
export interface ExtendedBillConstructor extends BillConstructor {
  kotVisible: boolean;
  flipped: boolean;
  kotOrBillVisible: 'kot' | 'bill' | false;
}

function roundOffPipe(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
