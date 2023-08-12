import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoyaltyPage } from './loyalty.page';

const routes: Routes = [
  {
    path: '',
    component: LoyaltyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoyaltyPageRoutingModule {}
