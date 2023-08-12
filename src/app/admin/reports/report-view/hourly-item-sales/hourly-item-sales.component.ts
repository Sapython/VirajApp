import { Component, Input } from '@angular/core';
import { Subscription, ReplaySubject } from 'rxjs';
import { BillConstructor } from 'src/app/core/types/bill.structure';
import { KotConstructor } from 'src/app/core/types/kot.structure';
import { ReportService } from '../../report.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DataProvider } from 'src/app/core/services/data-provider/data-provider.service';
import { Product } from 'src/app/core/types/product.structure';
import { ApplicableComboConstructor } from 'src/app/core/types/combo.structure';

@Component({
  selector: 'app-hourly-item-sales',
  templateUrl: './hourly-item-sales.component.html',
  styleUrls: ['./hourly-item-sales.component.scss'],
})
export class HourlyItemSalesComponent {
  hours: number[] = Array(24)
    .fill(0)
    .map((res, index) => index);
    downloadPDfSubscription: Subscription = Subscription.EMPTY;
  downloadExcelSubscription: Subscription = Subscription.EMPTY;
  reportChangedSubscription: Subscription = Subscription.EMPTY;
  items: ReplaySubject<ProductHourlySales[]> = new ReplaySubject<
    ProductHourlySales[]
  >();
  loading: boolean = true;
  joinArray(bill: KotConstructor[]) {
    // join to form a string of ids with comma
    return bill.map((res) => res.id).join(', ');
  }

  constructor(private reportService: ReportService,private dataProvider: DataProvider,) {}

  ngOnInit(): void {
    this.dataProvider.currentBusiness.subscribe((business) => {
      this.reportService.dataChanged.subscribe(() => {
        this.reportService
          .getBills(
            this.reportService.dateRangeFormGroup.value.startDate,
            this.reportService.dateRangeFormGroup.value.endDate,
            business.businessId
          )
          .then((bills) => {
            console.log('Bills ', bills);
            let productBaseSales: ProductHourlySales[] = [];
            let allProducts: any[] = [];
            bills.forEach((bill:any) => {
              console.log('Bill', bill);
              bill.kots.forEach((kot:any) => {
                console.log('Kot', kot);
                kot.products.forEach((product:any) => {
                  console.log('Product', product);
                  if (product.itemType == 'product') {
                    let findIndex = productBaseSales.findIndex(
                      (res:any) => res.id == product.id,
                    );
                    if (findIndex == -1) {
                      productBaseSales.push({
                        ...product,
                        hourlySales: Array(24).fill(0),
                        itemType: 'product',
                      });
                    } else {
                      productBaseSales[findIndex].hourlySales[
                        kot.createdDate.toDate().getHours()
                      ] += product.quantity;
                    }
                  } else if (product.itemType == 'combo') {
                  }
                });
              });
            });
            console.log(
              'productBaseSales',
              productBaseSales,
              'allProducts',
              allProducts,
            );
            this.items.next(productBaseSales);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    });
    this.downloadPDfSubscription = this.reportService.downloadPdf.subscribe(
      () => {
        this.downloadPdf();
      },
    );
    this.downloadExcelSubscription = this.reportService.downloadPdf.subscribe(
      () => {
        this.downloadExcel();
      },
    );
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
  }

  ngOnDestroy(): void {
    this.reportChangedSubscription.unsubscribe();
    this.downloadPDfSubscription.unsubscribe();
    this.downloadExcelSubscription.unsubscribe();
  }
}
interface ProductHourlySales extends Product {
  hourlySales: number[];
  itemType: 'product';
}
interface ComboHourlySales extends ApplicableComboConstructor {
  hourlySales: number[];
  itemType: 'combo';
}
