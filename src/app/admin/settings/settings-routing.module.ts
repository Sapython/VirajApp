import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'biller',
    loadChildren: () => import('./biller/biller.module').then( m => m.BillerPageModule)
  },
  {
    path: 'business',
    loadChildren: () => import('./business/business.module').then( m => m.BusinessPageModule)
  },
  {
    path: 'payment',
    loadChildren: () => import('./payment/payment.module').then( m => m.PaymentPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'loyalty',
    loadChildren: () => import('./loyalty/loyalty.module').then( m => m.LoyaltyPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}
