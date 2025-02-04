import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription, ReplaySubject } from 'rxjs';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { KotConstructor } from 'src/app/core/types/kot.structure';
import { ReportService } from '../../report.service';
import { DownloadService } from 'src/app/core/services/download.service';
import { timedBillConstructor } from '../report-view.component';

@Component({
  selector: 'app-cancelled-bills',
  templateUrl: './cancelled-bills.component.html',
  styleUrls: ['./cancelled-bills.component.scss'],
})
export class CancelledBillsComponent implements OnInit {
  downloadPDfSubscription: Subscription = Subscription.EMPTY;
  downloadExcelSubscription: Subscription = Subscription.EMPTY;
  reportChangedSubscription: Subscription = Subscription.EMPTY;
  bills: ReplaySubject<timedBillConstructor[]> = new ReplaySubject<
    timedBillConstructor[]
  >();
  billTotals:{
    numberOfBills:number,
    numberOfOrders:number,
    total:number,
    numberOfKots:number,
    numberOfUsers:number,
    totalBillTime:string,
    totalAmount:number,
    totalDiscount:number,
    totalTax:number,
  }={
    numberOfBills:0,
    numberOfOrders:0,
    total:0,
    numberOfKots:0,
    numberOfUsers:0,
    totalBillTime:"",
    totalAmount:0,
    totalDiscount:0,
    totalTax:0,
  };
  loading: boolean = true;
  joinArray(bill: KotConstructor[]) {
    // join to form a string of ids with comma
    return bill.map((res) => res.id).join(', ');
  }

  constructor(
    private reportService: ReportService,
    private dataProvider: DataProvider,
    private downloadService:DownloadService
  ) {}
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
              let productBaseSales: timedBillConstructor[] = bills.map((bill) => {
                let totalBillTime = '';
                if (bill?.createdDate?.toDate() && bill.settlement?.time?.toDate()) {
                  let billTime = new Date(bill.createdDate?.toDate());
                  // time difference between bill.createdDate time and bill.settlement.time
                  let settlementTime = new Date(bill.settlement?.time.toDate());
                  let timeDifference = settlementTime.getTime() - billTime.getTime();
                  billTime = new Date(timeDifference);
                  let hours = billTime.getHours();
                  let minutes = billTime.getMinutes();
                  let seconds = billTime.getSeconds();
                  totalBillTime = `${hours}:${minutes}:${seconds}`;
                };
                let mergedProducts:any[] = [];
                bill.kots.forEach((kot) =>{
                  if (kot.products) {
                    kot.products.forEach((product) => {
                      let index = mergedProducts.findIndex((res) => res.id === product.id);
                      if (index === -1) {
                        mergedProducts.push(product);
                      } else {
                        mergedProducts[index].quantity += product.quantity;
                      }
                    })
                  }
                });
                return {
                  ...bill,
                  totalBillTime,
                  mergedProducts
                };
              });
              this.billTotals ={
                numberOfBills:bills.reduce((acc, curr) => curr.billNo ? acc + 1 : acc, 0),
                numberOfOrders:bills.reduce((acc, curr) => curr.orderNo ? acc + 1 : acc, 0),
                total:bills.reduce((acc, curr) => acc + curr.billing.grandTotal, 0),
                numberOfKots:bills.reduce((acc, curr) => acc + curr.kots.length, 0),
                numberOfUsers:bills.reduce((acc, curr) => acc + curr.kots.length, 0),
                totalBillTime:productBaseSales.filter((bill)=>bill.totalBillTime).reduce((acc, curr) => {
                  let timeArray = curr.totalBillTime.split(':');
                  let hours = parseInt(timeArray[0]);
                  let minutes = parseInt(timeArray[1]);
                  let seconds = parseInt(timeArray[2]);
                  acc[0] += hours;
                  acc[1] += minutes;
                  acc[2] += seconds;
                  if (acc[2] > 60) {
                    acc[1] += Math.floor(acc[2] / 60);
                    acc[2] = acc[2] % 60;
                  }
                  if (acc[1] > 60) {
                    acc[0] += Math.floor(acc[1] / 60);
                    acc[1] = acc[1] % 60;
                  }
                  console.log("Time formatted",acc);
                  return acc;
                }, [0, 0, 0]).join(':'),
                totalAmount:bills.reduce((acc, curr) => acc + curr.billing.grandTotal, 0),
                totalDiscount:bills.reduce((acc, curr) => acc + 
                  curr.billing.discount.reduce((acc, curr) => acc + curr.totalAppliedDiscount, 0)
                , 0),
                totalTax:bills.reduce((acc, curr) => acc + curr.billing.taxes.reduce((acc, curr) => acc + curr.amount, 0), 0),
              };
              this.bills.next(productBaseSales);
              this.loading = false;
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

  async downloadPdf() {
    const doc = new jsPDF('l','mm', [500, 300]);
    let title = 'Bill Wise';
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
        if (y = data.cursor) 
        y = data.cursor.y;
      },
    });
    autoTable(doc, { html: '#reportTable' });
    doc.save('Bill Wise Report' + new Date().toLocaleString() + '.pdf');
    this.downloadService.saveAndOpenFile(doc.output('datauristring'),'Bill Wise Report' + new Date().toLocaleString() + '.pdf','pdf','application/pdf');
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
      'Bill Wise Report' + new Date().toLocaleString() + '.csv','csv','text/csv');
  }

  ngOnDestroy(): void {
    this.reportChangedSubscription.unsubscribe();
    this.downloadPDfSubscription.unsubscribe();
    this.downloadExcelSubscription.unsubscribe();
  }
}
