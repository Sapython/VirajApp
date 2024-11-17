import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportsPage } from './reports.page';
import { ReportViewComponent } from './report-view/report-view.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsPage,
  },
  {
    path: 'view/:reportId',
    component:ReportViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsPageRoutingModule {}
