import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HoldedBillsPage } from './holded-bills.page';

const routes: Routes = [
  {
    path: '',
    component: HoldedBillsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HoldedBillsPageRoutingModule {}
