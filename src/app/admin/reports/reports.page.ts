import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Fuse from 'fuse.js';
import { Subject, debounceTime } from 'rxjs';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  reportFormats:ReportFormat[] = [
    {
      title: 'Item Wise Sales',
      code: 'itemWise',
      description: 'List of items and their sales, with bills and kots.',
    },
    {
      title: 'All Bills',
      code: 'billWise',
      description:
        'List of bills from all channels, with their sales and settlements.',
    },
    {
      title: 'Dine In Bills',
      code: 'dineInBills',
      description:
        'List of bills from dine in channel, with their sales and settlements.',
    },
    {
      title: 'Takeaway Bills',
      code: 'takeawayBills',
      description:
        'List of bills from takeaway channel, with their sales and settlements.',
    },
    {
      title: 'Online Bills',
      code: 'onlineBills',
      description:
        'List of bills from online channel, with their sales and settlements.',
    },
    {
      title: 'Table Wise Sales',
      code: 'tableWiseSales',
      description:
        'List of bills from online channel, with their sales and settlements.',
    },
    {
      title: 'Day Summary',
      code: 'daySummary',
      description:
        'Full day summary with all bills, kots, sales, settlements, etc.',
    },
    {
      title: 'KOT wise report',
      code: 'kotWise',
      description: 'List of KOTs with their timings, waiter, items.',
    },
    {
      title: 'Discounted Bills',
      code: 'discounted',
      description:
        'List of bills on which discount has been applied, and discounted amount.',
    },
    {
      title: 'Non Chargeable Bills',
      code: 'ncBills',
      description: 'List of bills which have been marked as NC.',
    },
    {
      title: 'Bill Edits',
      code: 'billEdits',
      description:
        'List of bills which have been edited, with name and timings.',
    },
    {
      title: 'Customer Wise Report',
      code: 'customerWiseReport',
      description: 'List of customers and their spending with loyalty points.',
    },
    {
      title: 'Hourly Item Sales',
      code: 'hourlyItemSales',
      description: 'List of items sold by per hour basis in 24 hours.',
    },
    {
      title: 'Kot Edits',
      code: 'kotEdits',
      description: 'List of KOTs that has been edited, with name and timings.',
    },
    {
      title: 'Payment Wise',
      code: 'paymentWise',
      description: 'List of payment channels and their total received money.',
    },
    {
      title: 'Waiter wise items',
      code: 'waiterWiseItems',
      description: 'List of items and what waiter has ordered.',
    },
    {
      title: 'Table Wise Activity',
      code: 'tableWiseActivity',
      description: 'List of tables with merge, exchange, split actions.',
    },
  ];
  fuseSearchInstance:Fuse<ReportFormat> = new Fuse(this.reportFormats,{keys:['title','description']});
  filteredReportFormats:ReportFormat[] = [];
  reportSearchSubject:Subject<string> = new Subject<string>();
  reportMode:
    | 'billWise'
    | 'kotWise'
    | 'itemWise'
    | 'discounted'
    | 'ncBills'
    | 'takeawayBills'
    | 'onlineBills'
    | 'daySummary'
    | 'consolidated'
    | 'takeawayTokenWise'
    | 'onlineTokenWise'
    | 'tableWise'
    | false = false;
  range = new FormGroup({
    start: new FormControl<Date | null>(new Date(), [Validators.required]),
    end: new FormControl<Date | null>(new Date(), [Validators.required]),
  });
  constructor() {
    this.filteredReportFormats = this.reportFormats.slice();
    this.reportSearchSubject.pipe(debounceTime(600)).subscribe((res) => {
      if (res.trim().length > 0) {
        this.filteredReportFormats = this.fuseSearchInstance.search(res.trim()).map(res=>res.item);
      } else {
        this.filteredReportFormats = this.reportFormats.slice();
      }
    })
  }

  ngOnInit() {
  }

}

interface ReportFormat {
  title: string;
  code:'billWise'
  | 'kotWise'
  | 'itemWise'
  | 'discounted'
  | 'ncBills'
  | 'takeawayBills'
  | 'onlineBills'
  | 'daySummary'
  | 'consolidated'
  | 'takeawayTokenWise'
  | 'onlineTokenWise'
  | 'tableWise'
  | 'billEdits'
  | 'customerWiseReport'
  | 'dineInBills'
  | 'hourlyItemSales'
  | 'kotEdits'
  | 'paymentWise'
  | 'waiterWiseItems'
  | 'tableWiseSales'
  | 'tableWiseActivity';
  description: string;
}