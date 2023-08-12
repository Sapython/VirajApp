import { Component, Input, OnInit } from '@angular/core';
import { BillConstructor } from 'src/app/core/types/bill.structure';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KotConstructor } from 'src/app/core/types/kot.structure';

@Component({
  selector: 'app-kot-preview',
  templateUrl: './kot-preview.component.html',
  styleUrls: ['./kot-preview.component.scss'],
})
export class KotPreviewComponent  implements OnInit {
  @Input() bill:BillConstructor|undefined;
  constructor() { }

  ngOnInit() {
    console.log("Received bill for kot preview",this.bill);
    
  }

  async downloadKotInvoice(
    mainKot: KotConstructor,
    billConstructor: BillConstructor,
  ) {
    // convert kot to printable kot
    let allProducts:any[] = [];
    mainKot.products.forEach((product) => {
      if (product.itemType == 'product') {
        allProducts.push(product);
      } else if (product.itemType == 'combo') {
        product.productSelection.forEach((item:any) => {
          item.products.forEach((product:any) => {
            allProducts.push(product);
          });
        });
      }
    });
    // remove duplicates by adding quantity
    allProducts = allProducts.reduce((acc, current) => {
      const x = acc.find((item:any) => item.id === current.id);
      if (!x) {
        return acc.concat([current]);
      } else {
        x.quantity += current.quantity;
        return acc;
      }
    }, []);
    let kot = {
      date: mainKot.createdDate.toDate().toLocaleDateString(),
      time: mainKot.createdDate.toDate().toLocaleTimeString(),
      mode: mainKot.mode || 'firstChargeable',
      orderNo: billConstructor.orderNo,
      table: billConstructor.table as unknown as string,
      token: mainKot.id,
      billingMode: billConstructor.mode,
      products: allProducts.map((product) => {
        return {
          id: product.id,
          name: product.name,
          instruction: product.instruction || '',
          quantity: product.quantity,
          edited: product.cancelled,
          category: product.category,
          specificPrinter: product.specificPrinter,
        };
      }),
    };
    const doc = new jsPDF('p', 'mm', [200, 80]);
    let body = [];
    let currentPageCursor = 0;
    var head;
    // 'firstChargeable'|'cancelledKot'|'editedKot'|'runningNonChargeable'|'runningChargeable'|'firstNonChargeable'|'reprintKot'|'online'
    if (kot.mode == 'firstChargeable') {
      head = {
        content: 'First Chargeable',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'cancelledKot') {
      head = {
        content: 'Cancelled',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'editedKot') {
      head = {
        content: 'Edited',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'runningNonChargeable') {
      head = {
        content: 'Running Non Chargeable',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'runningChargeable') {
      head = {
        content: 'Running Chargeable',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'firstNonChargeable') {
      head = {
        content: 'First Non Chargeable',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'reprintKot') {
      head = {
        content: 'Reprint',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    } else if (kot.mode == 'online') {
      head = {
        content: 'Online',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      };
    }
    let heading:any = [
      [{
        content:'Reprint',
        styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
      }],
      [head]
    ].filter((row) => {
      if(row[0]){
        return row[0].content;
      } else {
        return false;
      }
    });
    body.push(...heading);
    autoTable(doc, {
      startY: currentPageCursor,
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      body: [...body],
      theme: 'plain',
      didDrawCell: (data) => {
        if(data.cursor){
          currentPageCursor = data.cursor.y;
        }
      },
    });
    // heading section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 200, currentPageCursor + 1); //TODO: pending line
    currentPageCursor += 3;
    body = [];
    heading = [
      [
        {
          content: 'Date: ' + kot.date,
          styles: { halign: 'left' },
        },
        {
          content: 'Token: ' + kot.orderNo,
          styles: { halign: 'right' },
        },
      ],
      [
        {
          content: 'Kot No: ' + kot.token,
          styles: { halign: 'left' },
        },
        {
          content: this.getModeTitle(kot.billingMode) + ' No: ' + kot.table,
          styles: { halign: 'right' },
        },
      ],
    ];
    body.push(...heading);
    autoTable(doc, {
      startY: currentPageCursor,
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      body: [...body],
      theme: 'plain',
      didDrawCell: (data) => {
        if(data.cursor){
          currentPageCursor = data.cursor.y;
        }
      },
    });
    // kot info section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 200, currentPageCursor + 1); //TODO: pending line
    currentPageCursor += 3;
    body = [];
    let kotProducts:any[] = [];
    kot.products.forEach((product) => {
      kotProducts.push([
        {
          content:
            (product.edited ? 'X--' : '') +
            product.name +
            (product.edited ? 'X--' : ''),
          styles: { halign: 'left' },
        },
        {
          content: product.instruction,
        },
        {
          content: product.quantity,
          styles: { halign: 'right' },
        },
      ]);
    });
    heading = [
      [
        {
          content: 'Product',
          styles: { halign: 'left', fontSize: 10, fontStyle: 'bold' },
        },
        {
          content: 'Ins',
          styles: { halign: 'center', fontSize: 10, fontStyle: 'bold' },
        },
        {
          content: 'Qty',
          styles: { halign: 'right', fontSize: 10, fontStyle: 'bold' },
        },
      ],
      ...kotProducts,
    ].filter((row) => {
      return row[0].content;
    });
    body.push(...heading);
    autoTable(doc, {
      startY: currentPageCursor,
      margin: { top: 0, left: 0, right: 0, bottom: 0 },
      body: [...body],
      theme: 'plain',
      didDrawCell: (data) => {
        if(data.cursor){
          currentPageCursor = data.cursor.y;
        }
      },
    });
    doc.save('a4.pdf');
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

}
