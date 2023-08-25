import { Component, Input, OnInit } from '@angular/core';
import { DatabaseService } from '../../database/database.service';
import { DataProvider } from '../../data-provider/data-provider.service';
import { ModalController } from '@ionic/angular';
import { BillPreviewComponent } from 'src/app/widgets/bill-preview/bill-preview.component';
import { BillConstructor, PrintableBill } from 'src/app/core/types/bill.structure';
import { BusinessRecord } from 'src/app/core/types/user.structure';

@Component({
  selector: 'app-quick-bill',
  templateUrl: './quick-bill.component.html',
  styleUrls: ['./quick-bill.component.scss'],
})
export class QuickBillComponent  implements OnInit {
  @Input() billId:string|undefined;
  @Input() splittedBillId:string|undefined;
  stage:'loading'|'loaded'|'error' = 'loading';
  printableBilllConstructor:BillConstructor|undefined;
  constructor(private databaseService:DatabaseService,private dataProvider:DataProvider,private modalController:ModalController) {
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

  ngOnInit() {
    this.stage = 'loading';
    this.dataProvider.currentBusiness.subscribe((business)=>{
      if(business){
        if(this.billId && this.splittedBillId){
          console.log('Loading splitted bill',this.billId,this.splittedBillId);
          this.databaseService.getSplittedBill(this.billId,this.splittedBillId,business.businessId).then((bill)=>{
            console.log("Splitted bill: ",bill.data());
            if (bill.exists()){
              this.printableBilllConstructor= bill.data() as BillConstructor;
              this.stage = 'loaded';
            } else {
              this.stage= 'error';
            }
          }).catch(()=>{
            this.stage= 'error';
          })
        } else {
          console.log('Loading normal bill',this.billId);
          if (this.billId){
            this.databaseService.getBillPromise(business.businessId,this.billId).then((bill)=>{
              console.log("Original bill",bill.data());
              if (bill.exists()){
                this.printableBilllConstructor= bill.data() as BillConstructor;
                this.stage = 'loaded';
                console.log("Loaded bill",bill.data());
              } else {
                this.stage= 'error';
              }
            })
          } else {
            this.stage= 'error';
          }
        }
      }
    })
  }

}


function roundOffPipe(num: number) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}
