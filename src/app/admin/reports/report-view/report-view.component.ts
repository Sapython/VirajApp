import {
  AfterViewInit,
  Component,
  Inject,
  ViewEncapsulation,
} from '@angular/core';
import { ReportService } from '../report.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-view',
  templateUrl: './report-view.component.html',
  styleUrls: ['./report-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportViewComponent implements AfterViewInit {
  loading: boolean = false;
  stage:'billWise'| 'kotWise'| 'itemWise'| 'discounted'| 'ncBills'| 'takeawayBills'| 'onlineBills'| 'daySummary'| 'consolidated'| 'takeawayTokenWise'| 'onlineTokenWise'| 'tableWise'| 'billEdits'| 'customerWiseReport'| 'dineInBills'| 'hourlyItemSales'| 'kotEdits'| 'paymentWise'| 'waiterWiseItems'| 'tableWiseSales'| 'tableWiseActivity'|undefined;
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
