import { Component, Input } from '@angular/core';
import { BillConstructor } from 'src/app/core/types/bill.structure';
import { KotConstructor } from 'src/app/core/types/kot.structure';
import { Subscription, ReplaySubject } from 'rxjs';
import { ReportService } from '../../report.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { Product } from 'src/app/core/types/product.structure';
import { DownloadService } from 'src/app/core/services/download.service';

@Component({
  selector: 'app-waiter-wise-items',
  templateUrl: './waiter-wise-items.component.html',
  styleUrls: ['./waiter-wise-items.component.scss'],
})
export class WaiterWiseItemsComponent {
  downloadPDfSubscription: Subscription = Subscription.EMPTY;
  downloadExcelSubscription: Subscription = Subscription.EMPTY;
  reportChangedSubscription: Subscription = Subscription.EMPTY;
  waiterWiseSales: ReplaySubject<WaiterWiseSales> =
    new ReplaySubject<WaiterWiseSales>();
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
              let products: {
                product: Product;
                users: {
                  user: string;
                  sales: number;
                }[];
              }[] = [];
              let users: string[] = [];
              bills.forEach((bill) => {
                bill.kots.forEach((kot:any) => {
                  if (kot.user) {
                    if (
                      users.findIndex((res) => res == kot.user.username) == -1
                    ) {
                      users.push(kot.user.username);
                    }
                    kot.products.forEach((product:any) => {
                      let findIndex = products.findIndex(
                        (res) => res.product.id == product.id,
                      );
                      if (findIndex == -1) {
                        if (product.itemType == 'product') {
                          products.push({
                            product: product,
                            users: [
                              {
                                user: kot.user.username,
                                sales: product.quantity,
                              },
                            ],
                          });
                        }
                      } else {
                        if (product.itemType == 'product') {
                          let findUserIndex = products[findIndex].users.findIndex(
                            (res) => res.user == kot.user.username,
                          );
                          if (findUserIndex == -1) {
                            products[findIndex].users.push({
                              user: kot.user.username,
                              sales: product.quantity,
                            });
                          } else {
                            products[findIndex].users[findUserIndex].sales +=
                              product.quantity;
                          }
                        }
                      }
                    });
                  }
                });
              });
              // we have to create a array of users
              console.log('users wise sales', products);
              this.waiterWiseSales.next({
                users: users,
                productSales: products,
              });
              // now
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
    doc.save('Waiter Wise Report' + new Date().toLocaleString() + '.pdf');
    this.downloadService.saveAndOpenFile(doc.output('datauristring'),'Waiter wise report' + new Date().toLocaleString() + '.pdf','pdf','application/pdf');
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
      'Waiter Wise Items Report' + new Date().toLocaleString() + '.csv','csv','text/csv');
  }

  ngOnDestroy(): void {
    this.reportChangedSubscription.unsubscribe();
    this.downloadPDfSubscription.unsubscribe();
    this.downloadExcelSubscription.unsubscribe();
  }
}

interface ProductStaffSales extends Product {
  user: string;
}

interface WaiterWiseSales {
  users: string[];
  productSales: {
    product: Product;
    users: {
      user: string;
      sales: number;
    }[];
  }[];
}
[];
