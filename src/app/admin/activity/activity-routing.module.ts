import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActivityPage } from './activity.page';
import { SalesPage } from './sales/sales.page';
import { TablePage } from './table/table.page';
import { CustomerPage } from './customer/customer.page';

const routes: Routes = [
  {
    path: '',
    component: ActivityPage,
    children:[
      {
        path: 'sales',
        component:SalesPage
      },
      {
        path: 'table',
        component:TablePage
      },
      {
        path: 'customer',
        component:CustomerPage
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivityPageRoutingModule {}
