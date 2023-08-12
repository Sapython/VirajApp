import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CombosPage } from './combos.page';

const routes: Routes = [
  {
    path: '',
    component: CombosPage
  },
  {
    path: 'combo-detail/:comboId',
    loadChildren: () => import('./combo-detail/combo-detail.module').then( m => m.ComboDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CombosPageRoutingModule {}
