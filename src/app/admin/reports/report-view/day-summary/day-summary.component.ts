import { Component } from '@angular/core';
import { Subscription, ReplaySubject } from 'rxjs';
import { ReportService } from '../../report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { KotConstructor } from 'src/app/core/types/kot.structure';
import { DownloadService } from 'src/app/core/services/download.service';

@Component({
  selector: 'app-day-summary',
  templateUrl: './day-summary.component.html',
  styleUrls: ['./day-summary.component.scss'],
})
export class DaySummaryComponent {
  channelWiseDaySummary = {
    all: {
      totalBills: 0,
      netSales:0,
      totalAmount: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalKots: 0,
      totalProducts: 0,
      totalDiscountedBills: 0,
      totalCancelledBills: 0,
      totalCancelledAmount: 0,
      totalNcBills: 0,
      totalNcAmount: 0,
      paymentChannels:{}
    },
    dineIn: {
      totalBills: 0,
      netSales:0,
      totalAmount: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalKots: 0,
      totalProducts: 0,
      totalDiscountedBills: 0,
      totalCancelledBills: 0,
      totalCancelledAmount: 0,
      totalNcBills: 0,
      totalNcAmount: 0,
      paymentChannels:{}
    },
    takeaway: {
      totalBills: 0,
      netSales:0,
      totalAmount: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalKots: 0,
      totalProducts: 0,
      totalDiscountedBills: 0,
      totalCancelledBills: 0,
      totalCancelledAmount: 0,
      totalNcBills: 0,
      totalNcAmount: 0,
      paymentChannels:{}
    },
    online: {
      totalBills: 0,
      netSales:0,
      totalAmount: 0,
      totalDiscount: 0,
      totalTax: 0,
      totalKots: 0,
      totalProducts: 0,
      totalDiscountedBills: 0,
      totalCancelledBills: 0,
      totalCancelledAmount: 0,
      totalNcBills: 0,
      totalNcAmount: 0,
      paymentChannels:{}
    },
  };
  downloadPDfSubscription: Subscription = Subscription.EMPTY;
  downloadExcelSubscription: Subscription = Subscription.EMPTY;
  reportChangedSubscription: Subscription = Subscription.EMPTY;
  loading: boolean = true;
  joinArray(bill: KotConstructor[]) {
    // join to form a string of ids with comma
    return bill.map((res) => res.id).join(', ');
  }

  constructor(private reportService: ReportService,private dataProvider: DataProvider,private downloadService:DownloadService) {}

  ngOnInit(): void {
    this.dataProvider.currentBusiness.subscribe((business) => {
      this.reportChangedSubscription = this.reportService.dataChanged.subscribe(
        () => {
          this.loading = true;
          this.reportService
            .getBills(
              this.reportService.dateRangeFormGroup.value.startDate,
              this.reportService.dateRangeFormGroup.value.endDate,
              business.businessId
            )
            .then((bills) => {
              console.log('Bills ', bills);
              let dineInBills = bills.filter((res) => res.mode == 'dineIn');
              let takeawayBills = bills.filter((res) => res.mode == 'takeaway');
              let onlineBills = bills.filter((res) => res.mode == 'online');
              this.channelWiseDaySummary = {
                all: {
                  totalBills: bills.length,
                  totalAmount: this.roundOff(
                    bills.filter((res) => res.stage != 'cancelled')
                    .reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0,
                  )),
                  netSales: this.roundOff(bills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0,
                  ) - bills.reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalDiscount: this.roundOff(bills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) =>
                      acc +
                      res.billing.discount.reduce(
                        (a, b) => a + (b.totalAppliedDiscount || 0),
                        0,
                      ),
                    0,
                  )),
                  totalTax: this.roundOff(bills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalKots: bills
                    .map((res) => res.kots.length)
                    .reduce((a, b) => a + b, 0),
                  totalProducts: bills
                    .map((res) =>
                      res.kots
                        .map((res) => res.products.length)
                        .reduce((a, b) => a + b, 0),
                    )
                    .reduce((a, b) => a + b, 0),
                  totalDiscountedBills: bills.filter((res) => res.stage != 'cancelled').filter(
                    (res) => res.billing.discount.length > 0,
                  ).length,
                  totalCancelledBills: bills.filter(
                    (res) => res.stage == 'cancelled',
                  ).length,
                  totalCancelledAmount: this.roundOff(bills
                    .filter((res) => res.stage == 'cancelled')
                    .reduce((acc, res) => acc + res.billing.grandTotal, 0)),
                  totalNcBills: bills.filter((res) => res.nonChargeableDetail)
                    .length,
                  totalNcAmount: this.roundOff(bills
                    .filter((res) => res.nonChargeableDetail)
                    .reduce((acc, res) => acc + res.billing.subTotal, 0)),
                    paymentChannels: bills.reduce((acc:any, res) => {
                      console.log("res?.settlement?.payments",res?.settlement?.payments);
                      if (res?.settlement?.payments){
                        res.settlement.payments.forEach((payment) => {
                          if (!acc){
                            acc = {};
                          }
                          if (acc[payment.paymentMethod]) {
                            acc[payment.paymentMethod] += payment.amount;
                          } else {
                            acc[payment.paymentMethod] = payment.amount;
                          }
                        });
                        return acc;
                      } else {
                        return acc;
                      }
                    },{})
                },
                dineIn: {
                  totalBills: dineInBills.length,
                  totalAmount: this.roundOff(dineInBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0,
                  )),
                  netSales: this.roundOff(dineInBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0,
                  )- dineInBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalDiscount: this.roundOff(dineInBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) =>
                      acc +
                      res.billing.discount.reduce(
                        (a, b) => a + (b.totalAppliedDiscount || 0),
                        0,
                      ),
                    0,
                  )),
                  totalTax: this.roundOff(dineInBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalKots: dineInBills
                    .map((res) => res.kots.length)
                    .reduce((a, b) => a + b, 0),
                  totalProducts: dineInBills
                    .map((res) =>
                      res.kots
                        .map((res) => res.products.length)
                        .reduce((a, b) => a + b, 0),
                    )
                    .reduce((a, b) => a + b, 0),
                  totalDiscountedBills: dineInBills.filter(
                    (res) => res.billing.discount.length > 0,
                  ).length,
                  totalCancelledBills: dineInBills.filter(
                    (res) => res.stage == 'cancelled',
                  ).length,
                  totalCancelledAmount: this.roundOff(dineInBills
                    .filter((res) => res.stage == 'cancelled')
                    .reduce((acc, res) => acc + res.billing.grandTotal, 0)),
                  totalNcBills: dineInBills.filter(
                    (res) => res.nonChargeableDetail,
                  ).length,
                  totalNcAmount: this.roundOff(dineInBills
                    .filter((res) => res.nonChargeableDetail)
                    .reduce((acc, res) => acc + res.billing.subTotal, 0)),
                    // paymentChannels is like this {cash: 100, card: 200}
                    paymentChannels: dineInBills.reduce((acc:any, res) => {
                      if (res?.settlement?.payments){
                        res.settlement.payments.forEach((payment) => {
                          if (!acc){
                            acc = {};
                          }
                          if (acc[payment.paymentMethod]) {
                            acc[payment.paymentMethod] += payment.amount;
                          } else {
                            acc[payment.paymentMethod] = payment.amount;
                          }
                        });
                        return acc;
                      } else {
                        return acc;
                      }
                    },{})
                },
                takeaway: {
                  totalBills: takeawayBills.length,
                  totalAmount: this.roundOff(takeawayBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0)),
                  netSales: this.roundOff(takeawayBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0) - takeawayBills.reduce(
                      (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                      0,
                    )),
                  totalDiscount: this.roundOff(takeawayBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) =>
                      acc +
                      res.billing.discount.reduce(
                        (a, b) => a + (b.totalAppliedDiscount || 0),
                        0,
                      ),
                    0,
                  )),
                  totalTax: this.roundOff(takeawayBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalKots: takeawayBills
                    .map((res) => res.kots.length)
                    .reduce((a, b) => a + b, 0),
                  totalProducts: takeawayBills
                    .map((res) =>
                      res.kots
                        .map((res) => res.products.length)
                        .reduce((a, b) => a + b, 0),
                    )
                    .reduce((a, b) => a + b, 0),
                  totalDiscountedBills: takeawayBills.filter((res) => res.stage != 'cancelled').filter(
                    (res) => res.billing.discount.length > 0,
                  ).length,
                  totalCancelledBills: takeawayBills.filter(
                    (res) => res.stage == 'cancelled',
                  ).length,
                  totalCancelledAmount: this.roundOff(takeawayBills
                    .filter((res) => res.stage == 'cancelled')
                    .reduce((acc, res) => acc + res.billing.grandTotal, 0)),
                  totalNcBills: takeawayBills.filter(
                    (res) => res.nonChargeableDetail,
                  ).length,
                  totalNcAmount: this.roundOff(takeawayBills
                    .filter((res) => res.nonChargeableDetail)
                    .reduce((acc, res) => acc + res.billing.subTotal, 0)),
                    paymentChannels: takeawayBills.reduce((acc:any, res) => {
                      if (res?.settlement?.payments){
                        res.settlement.payments.forEach((payment) => {
                          if (!acc){
                            acc = {};
                          }
                          if (acc[payment.paymentMethod]) {
                            acc[payment.paymentMethod] += payment.amount;
                          } else {
                            acc[payment.paymentMethod] = payment.amount;
                          }
                        });
                        return acc;
                      } else {
                        return acc;
                      }
                    },{})
                },
                online: {
                  totalBills: onlineBills.length,
                  totalAmount: this.roundOff(onlineBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0,
                  )),
                  netSales: this.roundOff(onlineBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.grandTotal,
                    0,
                  ) - onlineBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalDiscount: this.roundOff(onlineBills.filter((res) => res.stage != 'cancelled').reduce(
                    (acc, res) =>
                      acc +
                      res.billing.discount.reduce(
                        (a, b) => a + (b.totalAppliedDiscount || 0),
                        0,
                      ),
                    0,
                  )),
                  totalTax: this.roundOff(onlineBills.reduce(
                    (acc, res) => acc + res.billing.taxes.reduce((a, b) => a + b.amount, 0),
                    0,
                  )),
                  totalKots: onlineBills
                    .map((res) => res.kots.length)
                    .reduce((a, b) => a + b, 0),
                  totalProducts: onlineBills
                    .map((res) =>
                      res.kots
                        .map((res) => res.products.length)
                        .reduce((a, b) => a + b, 0),
                    )
                    .reduce((a, b) => a + b, 0),
                  totalDiscountedBills: onlineBills.filter(
                    (res) => res.billing.discount.length > 0,
                  ).length,
                  totalCancelledAmount: this.roundOff(onlineBills
                    .filter((res) => res.stage == 'cancelled')
                    .reduce((acc, res) => acc + res.billing.grandTotal, 0)),
                  totalCancelledBills: onlineBills.filter(
                    (res) => res.stage == 'cancelled',
                  ).length,
                  totalNcBills: onlineBills.filter(
                    (res) => res.nonChargeableDetail,
                  ).length,
                  totalNcAmount: this.roundOff(onlineBills
                    .filter((res) => res.nonChargeableDetail)
                    .reduce((acc, res) => acc + res.billing.subTotal, 0)),
                    paymentChannels: onlineBills.reduce((acc:any, res) => {
                      if (res?.settlement?.payments){
                        res.settlement.payments.forEach((payment) => {
                          if (!acc){
                            acc = {};
                          }
                          if (acc[payment.paymentMethod]) {
                            acc[payment.paymentMethod] += payment.amount;
                          } else {
                            acc[payment.paymentMethod] = payment.amount;
                          }
                        });
                        return acc;
                      } else {
                        return acc;
                      }
                    },{})
                },
              };
            })
            .catch((err) => {
              this.loading = false;
              console.log('Error in getting bills', err);
            });
        },
      );
    });
    this.downloadPDfSubscription = this.reportService.downloadPdf.subscribe(()=>{
      this.downloadPdf();
    });
    this.downloadExcelSubscription = this.reportService.downloadExcel.subscribe(()=>{
      this.downloadExcel();
    });
  }

  roundOff(num: number) {
    // use epsilon to 2 digits
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }


  async downloadPdf() {
    const doc = new jsPDF();
    let title = 'Day Summary';
    let logo = new Image();
    logo.src = 'assets/images/Vrajera.png';
    doc.addImage(logo, 'JPEG', 10, 10, 30.5, 17.5);
    doc.setFontSize(25);
    doc.text('Vrajera', 40, 23);
    doc.line(10, 30, 200, 30);
    doc.setFontSize(18);
    let y;
    autoTable(doc, {
      body: [
        [
          {
            content: title + ' Report',
            styles: { halign: 'left', fontSize: 17 },
          },
          {
            content:
              this.reportService.dateRangeFormGroup.value.startDate.toLocaleString(),
            styles: { halign: 'right', fontSize: 17 },
          },
          {
            content:this.reportService.dateRangeFormGroup.value.endDate ? 
              this.reportService.dateRangeFormGroup.value.endDate.toLocaleString() : '',
            styles: { halign: 'right', fontSize: 17 },
          },
        ],
      ],
      theme: 'plain',
      startY: 40,
      didDrawPage: function (data) {
        if(data.cursor?.y){
          if (y = data.cursor) 
y = data.cursor.y;
        }
      },
    });
    autoTable(doc, { html: '#reportTable' });
    doc.save('Day Summary Report' + new Date().toLocaleString() + '.pdf');
    this.downloadService.saveAndOpenFile(doc.output('datauristring'),'Day Summary Report' + new Date().toLocaleString() + '.pdf','pdf','application/pdf');
  }

  downloadExcel() {
    let separator = ',';
    // Select rows from table_id
    var rows = document.querySelectorAll('table#reportTable tr');
    // Construct csv
    let baseData = [
      'Date:',
      new Date().toLocaleString(),
      'User Id:',
      this.dataProvider.currentUser?.uid,
      'User email:',
      this.dataProvider.currentUser?.email,
    ];
    var csv = [baseData.join(separator)];
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols: any = rows[i].querySelectorAll('td, th');
      for (var j = 0; j < cols.length; j++) {
        // Clean innertext to remove multiple spaces and jumpline (break csv)
        var data = cols[j].innerText
          .replace(/(\r\n|\n|\r)/gm, '')
          .replace(/(\s\s)/gm, ' ');
        // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
        data = data.replace(/"/g, '""');
        // Push escaped string
        row.push('"' + data + '"');
      }
      csv.push(row.join(separator));
    }
    var csv_string = csv.join('\n');
    csv_string = csv_string.replace(/₹/g, ' ');
    // Download it
    var filename =
      'export_report-table_' + new Date().toLocaleString() + '.csv';
    var link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('target', '_blank');
    link.setAttribute(
      'href',
      'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string),
    );
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    let base64Data = btoa(csv_string);
    this.downloadService.saveAndOpenFile(
      base64Data,
      'Day Summary Report' + new Date().toLocaleString() + '.csv','csv','text/csv');
  }

  ngOnDestroy(): void {
    this.reportChangedSubscription.unsubscribe();
    this.downloadPDfSubscription.unsubscribe();
    this.downloadExcelSubscription.unsubscribe();
  }
}
