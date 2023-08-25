import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { BillEditsComponent } from './report-view/bill-edits/bill-edits.component';
import { BillWiseComponent } from './report-view/bill-wise/bill-wise.component';
import { ComboComponent } from './report-view/combo/combo.component';
import { ConsolidatedComponent } from './report-view/consolidated/consolidated.component';
import { CustomerWiseReportComponent } from './report-view/customer-wise-report/customer-wise-report.component';
import { DaySummaryComponent } from './report-view/day-summary/day-summary.component';
import { DineInBillsComponent } from './report-view/dine-in-bills/dine-in-bills.component';
import { HourlyItemSalesComponent } from './report-view/hourly-item-sales/hourly-item-sales.component';
import { ItemWiseReportComponent } from './report-view/item-wise-report/item-wise-report.component';
import { KotEditsComponent } from './report-view/kot-edits/kot-edits.component';
import { KotWiseReportComponent } from './report-view/kot-wise-report/kot-wise-report.component';
import { LoyaltyComponent } from './report-view/loyalty/loyalty.component';
import { NonChargeableBillsComponent } from './report-view/non-chargeable-bills/non-chargeable-bills.component';
import { OnlineBillsComponent } from './report-view/online-bills/online-bills.component';
import { PaymentWiseComponent } from './report-view/payment-wise/payment-wise.component';
import { SplitBillsComponent } from './report-view/split-bills/split-bills.component';
import { TableExchangesComponent } from './report-view/table-exchanges/table-exchanges.component';
import { TableMergesComponent } from './report-view/table-merges/table-merges.component';
import { TableSplitsComponent } from './report-view/table-splits/table-splits.component';
import { TableWiseComponent } from './report-view/table-wise/table-wise.component';
import { TakeawayBillsComponent } from './report-view/takeaway-bills/takeaway-bills.component';
import { WaiterWiseItemsComponent } from './report-view/waiter-wise-items/waiter-wise-items.component';
import { ReportViewComponent } from './report-view/report-view.component';
import { DiscountedBillsComponent } from './report-view/discounted-bills/discounted-bills.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DiscountedBillsPipe } from './report-view/discounted-bills.pipe';
import { HistoryComponent } from './history/history.component';
import {MatSelectModule} from '@angular/material/select';
import { DateGroupPipe } from './history/date-group.pipe';
import { ModePipe } from './history/mode.pipe';
import { TableGroupsPipe } from './history/table-groups.pipe';
import { CancelledBillsComponent } from './report-view/cancelled-bills/cancelled-bills.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule,
    WidgetsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  declarations: [
    ReportsPage,
    BillEditsComponent,
    BillWiseComponent,
    ComboComponent,
    ConsolidatedComponent,
    CustomerWiseReportComponent,
    DaySummaryComponent,
    DineInBillsComponent,
    HourlyItemSalesComponent,
    ItemWiseReportComponent,
    KotEditsComponent,
    KotWiseReportComponent,
    LoyaltyComponent,
    NonChargeableBillsComponent,
    OnlineBillsComponent,
    PaymentWiseComponent,
    SplitBillsComponent,
    TableExchangesComponent,
    TableMergesComponent,
    TableSplitsComponent,
    TableWiseComponent,
    TakeawayBillsComponent,
    WaiterWiseItemsComponent,
    ReportViewComponent,
    DiscountedBillsComponent,
    DiscountedBillsPipe,
    HistoryComponent,
    DateGroupPipe,
    ModePipe,
    TableGroupsPipe,
    CancelledBillsComponent
  ],
})
export class ReportsPageModule {}
