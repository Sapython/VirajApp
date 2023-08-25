import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subscription } from 'rxjs';
import { ReportService } from '../../report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { Timestamp } from '@angular/fire/firestore';
import { DownloadService } from 'src/app/core/services/download.service';

@Component({
  selector: 'app-table-merges',
  templateUrl: './table-merges.component.html',
  styleUrls: ['./table-merges.component.scss'],
})
export class TableMergesComponent implements OnInit, OnDestroy {
  downloadPDfSubscription: Subscription = Subscription.EMPTY;
  downloadExcelSubscription: Subscription = Subscription.EMPTY;
  tableMergeReport: ReplaySubject<TableActivity[]> = new ReplaySubject<
    TableActivity[]
  >(1);
  loading: boolean = true;
  constructor(private reportService: ReportService,private dataProvider: DataProvider,private downloadService:DownloadService) {}
  ngOnDestroy(): void {
    this.downloadPDfSubscription.unsubscribe();
    this.downloadExcelSubscription.unsubscribe();
    this.tableMergeReport.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.dataProvider.currentBusiness.subscribe((business) => {
      this.reportService.dataChanged.subscribe(() => {
        this.reportService
          .getTableActivity(business.businessId)
          .then((res: any) => {
            this.tableMergeReport.next(res);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    });
  }


  async downloadPdf() {
    const doc = new jsPDF();
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
    doc.save('Table Merge/exchange Report' + new Date().toLocaleString() + '.pdf');
    this.downloadService.saveAndOpenFile(doc.output('datauristring'),'Table Merge/exchange report' + new Date().toLocaleString() + '.pdf','pdf','application/pdf');
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
      'Table Merge/exchange Report' + new Date().toLocaleString() + '.csv','csv','text/csv');
  }
}

export interface TableActivity {
  time: Timestamp | any;
  from: any;
  to: any;
  items?: any[];
  type: 'move' | 'merge' | 'exchange';
}
