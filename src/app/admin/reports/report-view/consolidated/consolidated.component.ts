import { Component } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { KotConstructor } from 'src/app/core/types/kot.structure';
import { Tax } from 'src/app/core/types/tax.structure';
import { ReportService } from '../../report.service';
import { BillConstructor } from 'src/app/core/types/bill.structure';
import { debounceTime } from 'rxjs';
import { DownloadService } from 'src/app/core/services/download.service';

@Component({
  selector: 'app-consolidated',
  templateUrl: './consolidated.component.html',
  styleUrls: ['./consolidated.component.scss'],
})
export class ConsolidatedComponent {
  
  loading: boolean = false;
  constructor(public reportService: ReportService,private dataProvider:DataProvider,private downloadService:DownloadService) {
    this.dataProvider.currentBusiness.subscribe((business)=>{
      this.reportService.refetchConsolidated.pipe(debounceTime(1000)).subscribe(() => {
        this.reportService
        .getBills(
          this.reportService.dateRangeFormGroup.value.startDate,
          this.reportService.dateRangeFormGroup.value.endDate,
          business.businessId
        )
        .then((localBills) => {
          console.log("bills local",localBills);
          let filteredLocalBills = localBills.filter(
            (res) =>
              res.settlement &&
              res.billing.grandTotal < this.reportService.consolidatedMaxAmount &&
              res.billing.grandTotal > 0,
          );
          //  console.log("bills",filteredLocalBills);
          let taxes: Tax[] = [];
          filteredLocalBills.forEach((bill) => {
            bill.billing.taxes.forEach((tax) => {
              let index = taxes.findIndex((res) => res.id == tax.id);
              if (index == -1) {
                taxes.push(JSON.parse(JSON.stringify(tax)));
              } else {
                //  console.log("Adding tax",taxes[index].amount,tax.amount,taxes[index].amount + tax.amount);
                taxes[index].amount = taxes[index].amount + tax.amount;
              }
            });
          });
          this.reportService.consolidatedSummary = {
            bills: filteredLocalBills,
            totalSubtotal: filteredLocalBills.reduce(
              (acc, res) => acc + res.billing.subTotal,
              0,
            ),
            totalGrandTotal: filteredLocalBills.reduce(
              (acc, res) => acc + res.billing.grandTotal,
              0,
            ),
            totalTaxes: taxes,
          };
          this.loading = false;
        });
      })
    })
  }
  ngOnInit(): void {
    this.loading = true;
    this.reportService.downloadExcel.subscribe(() => {});
  }

  async downloadPdf() {
    const doc = new jsPDF();
    let title = 'Consolidated Report';
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
    doc.save('Consolidated Report' + new Date().toLocaleString() + '.pdf');
    this.downloadService.saveAndOpenFile(doc.output('datauristring'),'Consolidated Report' + new Date().toLocaleString() + '.pdf','pdf','application/pdf');
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
      'Consolidated Report' + new Date().toLocaleString() + '.csv','csv','text/csv');
  }

  joinArray(bill: KotConstructor[]) {
    // join to form a string of ids with comma
    return bill.map((res) => res.id).join(', ');
  }
}