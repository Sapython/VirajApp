import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComboDetailPage } from './combo-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ComboDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComboDetailPageRoutingModule {}
