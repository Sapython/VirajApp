import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subject } from 'rxjs';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { BillConstructor } from 'src/app/core/types/bill.structure';
import { ReportService } from '../../report.service';
import { DownloadService } from 'src/app/core/services/download.service';

@Component({
  selector: 'app-split-bills',
  templateUrl: './split-bills.component.html',
  styleUrls: ['./split-bills.component.scss'],
})
export class SplitBillsComponent {
  bills:Subject<ExtendedSplittedBill[]> = new Subject<ExtendedSplittedBill[]>();
  constructor(private reportService:ReportService,private dataProvider:DataProvider,private downloadService:DownloadService) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.reportService.dataChanged.subscribe(()=>{
        this.reportService.getBills(this.reportService.dateRangeFormGroup.value.startDate,this.reportService.dateRangeFormGroup.value.endDate,business.businessId).then(async (res)=>{
          this.bills.next([]);
          let finalizedBills:ExtendedSplittedBill[] = []
          await Promise.all(res.map(async (bill)=>{
            if(bill?.settlement?.additionalInfo.splitBill && bill?.settlement?.additionalInfo.bills?.length > 0){
              let bills = await Promise.all(bill?.settlement?.additionalInfo.bills.map(async (splitBillId:string)=>{
                let billDoc = await this.reportService.getSplittedBill(bill.id,splitBillId,business.businessId);
                return billDoc.data();
              }));
              bills.forEach((splittedBill)=>{
                console.log("splittedBill",splittedBill);
                finalizedBills.push({
                  ...splittedBill,
                  originalBillId:bill.id,
                  originalBillAmount:bill.billing.grandTotal,
                  originalBillNo:bill.billNo,
                });
              });
            }
          }));
          this.bills.next(finalizedBills);
        });
      });
    })
    this.reportService.downloadExcel.subscribe(()=>{
      this.downloadExcel();
    });
    this.reportService.downloadPdf.subscribe(()=>{
      this.downloadPdf();
    });
  }

  async downloadPdf() {
    const doc = new jsPDF();
    let title = 'Splitted Bills';
    let logo = new Image();
    logo.src = 'assets/images/viraj.png';
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
        if(data.cursor){
          y = data.cursor.y;
        }
      },
    });
    autoTable(doc, { html: '#reportTable' });
    doc.save('Split Bill Report' + new Date().toLocaleString() + '.pdf');
    this.downloadService.saveAndOpenFile(doc.output('datauristring'),'Split Bill Report' + new Date().toLocaleString() + '.pdf','pdf','application/pdf');
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
      'User Name:',
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
      'Split Bill Report' + new Date().toLocaleString() + '.csv','csv','text/csv');
  }


  getReport(){

  }
}

interface ExtendedSplittedBill extends BillConstructor{
  originalBillId:string;
  originalBillAmount:number;
  originalBillNo:string;
}