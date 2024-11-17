import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardPage } from './onboard.page';

const routes: Routes = [
  {
    path: '',
    component: OnboardPage
  },
  {
    path: 'business-info',
    loadChildren: () => import('./business-info/business-info.module').then( m => m.BusinessInfoPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardPageRoutingModule {}
