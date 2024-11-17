import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BillerPage } from './biller.page';

const routes: Routes = [
  {
    path: '',
    component: BillerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillerPageRoutingModule {}
