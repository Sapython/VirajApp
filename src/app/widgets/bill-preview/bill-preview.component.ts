import { Component, Input, OnInit } from '@angular/core';
import { PrintableBill } from 'src/app/core/types/bill.structure';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DownloadService } from 'src/app/core/services/download.service';

@Component({
  selector: 'app-bill-preview',
  templateUrl: './bill-preview.component.html',
  styleUrls: ['./bill-preview.component.scss'],
})
export class BillPreviewComponent  implements OnInit {
  @Input() printableBillData: PrintableBill|undefined;
  constructor(private downloadService:DownloadService) { }

  ngOnInit() {}

  async downloadBillInvoice(bill: PrintableBill) {
    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF('p', 'mm', [300, 80]);
    let body = [];
    let currentPageCursor = 0;
    let heading:any = [
      [
        {
          content: 'Reprint',
          styles: { halign: 'center', fontSize: 12, fontStyle: 'bold' },
        },
      ],
      [
        {
          content: bill.businessDetails.name,
          styles: { halign: 'center', fontSize: 14, fontStyle: 'bold' },
        },
      ],
      [
        {
          content: bill.businessDetails.address,
          styles: { halign: 'center' },
        },
      ],
      [
        {
          content: bill.businessDetails.phone,
          styles: { halign: 'center' },
        },
      ],
      [
        {
          content: bill.businessDetails.fssai
            ? 'FSSAI: ' + bill.businessDetails.fssai
            : '',
          styles: { halign: 'left' },
        },
        {
          content: bill.businessDetails.gstin
            ? 'GST: ' + bill.businessDetails.gstin
            : '',
          styles: { halign: 'right' },
        },
      ],
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
    // heading section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 300, currentPageCursor + 1); //TODO: pending line
    currentPageCursor += 3;
    body = [];
    heading = [
      [
        {
          content: 'Customer Details',
          styles: { halign: 'left', fontSize: 11, fontStyle: 'bold' },
        },
      ],
      [
        {
          content: bill.customerDetail.name,
          styles: { halign: 'left' },
        },
      ],
      [
        {
          content: bill.customerDetail.phone,
          styles: { halign: 'left' },
        },
      ],
      [
        {
          content: bill.customerDetail.address,
          styles: { halign: 'left' },
        },
      ],
      [
        {
          content: bill.customerDetail.gstin,
          styles: { halign: 'left' },
        },
      ],
    ].filter((row) => {
      return row[0].content;
    });
    body.push(...heading);
    if (
      bill.customerDetail.name ||
      bill.customerDetail.phone ||
      bill.customerDetail.address ||
      bill.customerDetail.gstin
    ) {
      autoTable(doc, {
        startY: currentPageCursor,
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        body: [...body],
        theme: 'plain',
        didDrawCell: (data) => {
          if (data.section == 'body' && data.cursor) {
            currentPageCursor = data.cursor.y;
          }
        },
      });
      // customer section
      currentPageCursor += 10;
      doc.line(0, currentPageCursor, 300, currentPageCursor);
    }
    body = [];
    heading = [
      [
        {
          content: 'Date: ' + bill.date,
          styles: { halign: 'left' },
        },
        {
          content: 'Time: ' + bill.time,
          styles: { halign: 'left' },
        },
      ],
      [
        {
          content: 'Token: ' + bill.orderNo,
          styles: { halign: 'left' },
        },
        {
          content:
            'Bill: ' +
            (bill.billNoSuffix ? bill.billNoSuffix : '') +
            (bill.billNo || ''),
          styles: { halign: 'left' },
        },
      ],
      [
        {
          content: 'Cashier: ' + bill.cashierName,
          styles: { halign: 'left' },
        },
        {
          content: 'Mode: ' + bill.mode,
          styles: { halign: 'left' },
        },
      ],
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
        if (data.cursor){
          currentPageCursor = data.cursor.y;
        }
      },
    });
    // bill info section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 300, currentPageCursor + 1); //TODO: pending line
    currentPageCursor += 3;
    body = [];
    let products:any[] = [];
    console.log('bill.products', bill.products);
    bill.products.forEach((product) => {
      products.push([
        {
          content: product.name,
          styles: { halign: 'left' },
        },
        {
          content: product.quantity,
          styles: { halign: 'center' },
        },
        {
          content: 'Rs. ' + product.untaxedValue,
          styles: { halign: 'center' },
        },
        {
          content: 'Rs. ' + product.total,
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
          content: 'Qty',
          styles: { halign: 'center', fontSize: 10, fontStyle: 'bold' },
        },
        {
          content: 'Price',
          styles: { halign: 'center', fontSize: 10, fontStyle: 'bold' },
        },
        {
          content: 'Amount',
          styles: { halign: 'right', fontSize: 10, fontStyle: 'bold' },
        },
      ],
      ...products,
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
    // bill products section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 300, currentPageCursor + 1);
    currentPageCursor += 3;
    body = [];
    heading = [
      [
        {
          content: 'Total Qty: ' + bill.totalQuantity,
          styles: { halign: 'left', fontSize: 10 },
        },
        {
          content: 'Sub Total: ' + bill.subTotal,
          styles: { halign: 'right', fontSize: 11, fontStyle: 'bold' },
        },
      ],
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
    // bill total quantity section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 300, currentPageCursor + 1); //TODO: pending line
    currentPageCursor += 3;
    body = [];
    let discounts:any[] = [];
    bill.discounts.forEach((discount) => {
      discounts.push([
        {
          content: discount.name + (discount.type == 'flat' ? 'Rs.' : '%'),
          styles: { halign: 'left', fontSize: 10 },
        },
        {
          content: discount.rate,
          styles: { halign: 'center', fontSize: 10 },
        },
        {
          content: 'Rs. ' + discount.value,
          styles: { halign: 'right', fontSize: 10 },
        },
      ]);
    });
    heading = [
      [
        {
          content: 'Discount',
          styles: { halign: 'left', fontSize: 11, fontStyle: 'bold' },
        },
        {
          content: 'Rate',
          styles: { halign: 'center', fontSize: 11, fontStyle: 'bold' },
        },
        {
          content: 'Amount',
          styles: { halign: 'right', fontSize: 11, fontStyle: 'bold' },
        },
      ],
      ...discounts,
    ].filter((row) => {
      return row[0].content;
    });
    body.push(...heading);
    if (bill.discounts.length > 0) {
      autoTable(doc, {
        startY: currentPageCursor,
        margin: { top: 0, left: 0, right: 0, bottom: 0 },
        body: [...body],
        theme: 'plain',
        didDrawCell: (data) => {
          if (data.section == 'body') {
            if(data.cursor){
              currentPageCursor = data.cursor.y;
            }
          }
        },
      });
      // bill disocunts
      // bill total quantity section
      currentPageCursor += 10;
      doc.line(0, currentPageCursor, 300, currentPageCursor + 1); //TODO: pending line
      currentPageCursor += 3;
    }
    body = [];
    let taxes:any[] = [];
    bill.taxes.forEach((tax) => {
      taxes.push([
        {
          content: tax.name,
          styles: { halign: 'left' },
        },
        {
          content: tax.rate + '%',
          styles: { halign: 'center' },
        },
        {
          content: 'Rs. ' + tax.value,
          styles: { halign: 'right' },
        },
      ]);
    });
    heading = [
      [
        {
          content: 'Tax',
          styles: { halign: 'left', fontSize: 11, fontStyle: 'bold' },
        },
        {
          content: 'Rate',
          styles: { halign: 'center', fontSize: 11, fontStyle: 'bold' },
        },
        {
          content: 'Amount',
          styles: { halign: 'right', fontSize: 11, fontStyle: 'bold' },
        },
      ],
      ...taxes,
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
    // bill taxes section
    currentPageCursor += 10;
    doc.line(0, currentPageCursor, 300, currentPageCursor + 1); //TODO: pending line
    currentPageCursor += 3;
    body = [];
    heading = [
      [
        {
          content: 'Grand Total: ' + 'Rs.' + bill.grandTotal,
          styles: { halign: 'right', fontSize: 13, fontStyle: 'bold' },
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

    doc.save('a4.pdf');
    console.log(doc.output('datauristring'));
    this.downloadService.saveAndOpenFile(doc.output('datauristring'), 'bill.pdf', 'pdf', 'application/pdf');
  }


}
