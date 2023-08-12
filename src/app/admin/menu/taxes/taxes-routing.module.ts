import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TaxesPage } from './taxes.page';

const routes: Routes = [
  {
    path: '',
    component: TaxesPage
  },
  {
    path: 'tax-detail/:taxId',
    loadChildren: () => import('./tax-detail/tax-detail.module').then( m => m.TaxDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxesPageRoutingModule {}
