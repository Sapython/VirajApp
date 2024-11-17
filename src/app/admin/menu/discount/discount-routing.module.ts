import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiscountPage } from './discount.page';

const routes: Routes = [
  {
    path: '',
    component: DiscountPage
  },
  {
    path: 'discount-detail/:discountId',
    loadChildren: () => import('./discount-detail/discount-detail.module').then( m => m.DiscountDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiscountPageRoutingModule {}
