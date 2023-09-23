import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChargesPage } from './charges.page';

const routes: Routes = [
  {
    path: '',
    component: ChargesPage
  },
  {
    path: 'edit/:methodId',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChargesPageRoutingModule {}
