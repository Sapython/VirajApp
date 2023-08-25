import {
  AfterViewInit,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { ReportService } from '../report.service';
import { ActivatedRoute } from '@angular/router';
import { BillConstructor } from 'src/app/core/types/bill.structure';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportViewComponent implements AfterViewInit {
  loading: boolean = false;
  stage:'billWise'| 'kotWise'| 'billSplits' | 'itemWise'| 'discounted'| 'ncBills'| 'takeawayBills'| 'onlineBills'| 'daySummary'| 'consolidated'| 'takeawayTokenWise'| 'onlineTokenWise'| 'tableWise'| 'billEdits'| 'customerWiseReport'| 'dineInBills'| 'hourlyItemSales'| 'kotEdits'| 'paymentWise'| 'waiterWiseItems'| 'tableWiseSales'| 'tableWiseActivity' | 'cancelledBills' |undefined;
  constructor(
    private activatedRoute:ActivatedRoute,
    public reportService: ReportService,
  ) {
    this.activatedRoute.params.subscribe((params) => {
      console.log('params', params);
      this.stage = params['reportId'];
    });
  }

  download(){
    
  }

  ngAfterViewInit(): void {
    console.log(
      "document.getElementById('reportTable')",
      document.getElementById('reportTable'),
    );
  }
}

export interface timedBillConstructor extends BillConstructor {
  totalBillTime: string;
  mergedProducts: any[];
}